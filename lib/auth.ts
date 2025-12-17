/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/auth.ts
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import prisma from "@/lib/db"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { UserPlan, UserRole } from "./generated/prisma/enums"
import type { Adapter } from "next-auth/adapters"
import { Prisma } from "./generated/prisma/client"

// Validation schema for credentials
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma) as Adapter,
  
  // Session strategy
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // JWT configuration
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  providers: [
    // Google OAuth
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),

    // GitHub OAuth
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),

    // Email/Password credentials
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          // Validate input
          const { email, password } = loginSchema.parse(credentials)

          // Find user in database
          const user = await prisma.user.findUnique({
            where: { email },
          })

          if (!user || !user.password) {
            return null
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(password, user.password)
          if (!isPasswordValid) {
            return null
          }

          // Update last login
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() }
          }).catch(() => {
            // Silently fail if update doesn't work
          })

          // Return user object
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],

  // Custom pages
  pages: {
    signIn: "/auth/sign-in",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
  },

  // Callbacks for customization
  callbacks: {
    // JWT callback - handles token creation and updates
    jwt: async ({ token, user, account, trigger }) => {
      // Initial sign in - get data from user object
      if (user) {
        token.id = user.id
        token.role = (user as any).role
        token.name = user.name
        token.email = user.email
        token.picture = user.image
      }

      // For OAuth providers, fetch role from database on first sign-in
      if (account?.provider && account.provider !== "credentials" && user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: { 
            id: true, 
            role: true, 
            plan: true,
            email: true, 
            name: true, 
            image: true,
          },
        })

        if (dbUser) {
          token.id = dbUser.id
          token.role = dbUser.role
          token.plan = dbUser.plan
          token.name = dbUser.name
          token.picture = dbUser.image

          // Update last login for OAuth
          await prisma.user.update({
            where: { id: dbUser.id },
            data: { lastLoginAt: new Date() }
          }).catch(() => {
            // Silently fail if update doesn't work
          })
        }
      }

      // Refresh token data periodically or on update
      if (trigger === "update" && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email as string },
          select: { 
            id: true, 
            role: true,
            plan: true,
            email: true, 
            name: true, 
            image: true,
          },
        })

        if (dbUser) {
          token.id = dbUser.id
          token.role = dbUser.role
          token.plan = dbUser.plan
          token.name = dbUser.name
          token.picture = dbUser.image
        }
      }

      return token
    },

    // Session callback - exposes user data to the client
    session: async ({ session, token }) => {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as UserRole
        session.user.plan = token.plan as UserPlan
        session.user.email = token.email!
        session.user.name = token.name as string | null
        session.user.image = token.picture as string | null
      }

      return session
    },

    // Sign in callback - handles user creation and validation
    signIn: async ({ user, account, profile }) => {
      try {
        // For OAuth providers
        if (account?.provider !== "credentials") {
          if (user?.email) {
            const existingUser = await prisma.user.findUnique({
              where: { email: user.email },
            })

            // If user doesn't exist, create them with usage stats
            if (!existingUser) {
              const normalizedImage =
                typeof user.image === "string"
                  ? user.image
                  : typeof profile?.image === "string"
                  ? profile.image
                  : null

              const normalizedName =
                typeof user.name === "string"
                  ? user.name
                  : typeof profile?.name === "string"
                  ? profile.name
                  : null

              // Create user with usage stats in transaction
              await prisma.$transaction(async (tx) => {
                const newUser = await tx.user.create({
                  data: {
                    email: user.email!,
                    name: normalizedName || null,
                    image: normalizedImage || null,
                    role: "USER",
                    plan: "FREE",
                    emailVerified: new Date(),
                    isEmailVerified: true,
                    lastLoginAt: new Date(),
                  }
                })

                // Create usage stats for new user
                await tx.usageStats.create({
                  data: {
                    userId: newUser.id,
                    resumesCreated: 0,
                    resumesLimit: 1,
                    aiCreditsUsed: 0,
                    aiCreditsLimit: 10,
                  }
                })
              })
            } else {
              // Update last login for existing user
              await prisma.user.update({
                where: { id: existingUser.id },
                data: { lastLoginAt: new Date() }
              }).catch(() => {
                // Silently fail if update doesn't work
              })
            }
          }
          return true
        }

        // For credentials, user must exist (handled in authorize)
        return !!user
      } catch (error) {
        console.error("Sign-in callback error:", error)
        // Allow sign-in even if database operations fail
        return true
      }
    },

    // Redirect callback - handles post-login navigation
    redirect: async ({ url, baseUrl }) => {
      // Handle relative callback URLs
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`
      }
      
      // Handle same-origin URLs
      try {
        const urlObj = new URL(url)
        if (urlObj.origin === baseUrl) {
          return url
        }
      } catch {
        // Invalid URL, use default
      }
      
      // Default redirect to dashboard for logged-in users
      return `${baseUrl}/dashboard`
    },
  },

  // Events for logging and analytics
  events: {
    signIn: async ({ user, account, isNewUser }) => {
      console.log(`✅ User ${user.email} signed in with ${account?.provider}`)
      
      if (isNewUser && user.id) {
        console.log(`🎉 New user registered: ${user.email}`)
        
        // Log analytics event for new user
        await prisma.analytics.create({
          data: {
            eventType: "user_registered",
            userId: user.id,
            metadata: {
              provider: account?.provider,
              email: user.email,
            } as Prisma.InputJsonValue
          }
        }).catch(() => {
          // Silently fail if analytics doesn't work
        })
      } else if (user.id) {
        // Log analytics event for returning user
        await prisma.analytics.create({
          data: {
            eventType: "user_login",
            userId: user.id,
            metadata: {
              provider: account?.provider,
            } as Prisma.InputJsonValue
          }
        }).catch(() => {
          // Silently fail if analytics doesn't work
        })
      }
    },

    createUser: async ({ user }) => {
      console.log(`👤 New user created: ${user.email}`)
    },

    signOut: async (message) => {
      let token = undefined
      if (message && "token" in message) {
        token = (message as { token?: { email?: string; id?: string } | null }).token
      }
      
      if (token?.id) {
        // Log analytics event for sign out
        await prisma.analytics.create({
          data: {
            eventType: "user_logout",
            userId: token.id,
          }
        }).catch(() => {
          // Silently fail if analytics doesn't work
        })
      }
      
      console.log(`👋 User signed out: ${token?.email}`)
    },
  },

  // Security options
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production" 
        ? "__Secure-next-auth.session-token" 
        : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },

  // Debug in development
  debug: process.env.NODE_ENV === "development",

  // Custom error handling
  logger: {
    error: (error) => {
      console.error(`❌ Auth error:`, error)
    },
    warn: (code) => {
      console.warn(`⚠️ Auth warning [${code}]`)
    },
    debug: (code, metadata) => {
      if (process.env.NODE_ENV === "development") {
        console.debug(`🔍 Auth debug [${code}]:`, metadata)
      }
    },
  },

})