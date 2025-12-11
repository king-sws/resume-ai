// lib/auth.ts
import NextAuth, { DefaultSession } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import bcrypt from "bcryptjs"
import prisma from "./db"

declare module "next-auth" {
  interface User {
    role?: string
    plan?: string
    isEmailVerified?: boolean
  }
  interface Session {
    user: {
      id?: string
      role?: string
      plan?: string
      isEmailVerified?: boolean
    } & DefaultSession["user"]
  }
  interface JWT {
    role?: string
    plan?: string
    isEmailVerified?: boolean
  }
}


export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt", // Must use JWT for credentials provider
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/sign-in",
    signOut: "/auth/logout",
    error: "/auth/error",
    verifyRequest: "/auth/verify",
    newUser: "/dashboard",
  },
  providers: [
    // Credentials Provider (Email & Password)
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string }
          })

          if (!user || !user.password) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          )

          if (!isPasswordValid) {
            return null
          }

          // Update last login
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() }
          })

          // Return user object that matches User interface
          return {
            id: user.id,
            email: user.email!,
            name: user.name,
            image: user.image,
            role: user.role,
            plan: user.plan,
            isEmailVerified: user.isEmailVerified,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      }
    }),

    // Google Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),

    // GitHub Provider
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // For OAuth providers, ensure user has usage stats
      if (account?.provider !== "credentials") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { id: user.id },
            include: { usageStats: true }
          })

          if (existingUser) {
            // Update last login and verify email
            await prisma.user.update({
              where: { id: existingUser.id },
              data: { 
                lastLoginAt: new Date(),
                isEmailVerified: true,
              }
            })

            // Create usage stats if missing
            if (!existingUser.usageStats) {
              await prisma.usageStats.create({
                data: {
                  userId: existingUser.id,
                  resumesLimit: existingUser.plan === "FREE" ? 1 : -1,
                  aiCreditsLimit: existingUser.plan === "FREE" ? 10 : 100,
                }
              })
            }
          }
        } catch (error) {
          console.error("SignIn callback error:", error)
        }
      }

      return true
    },

    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user && user.id) {
        token.id = user.id
        token.role = user.role
        token.plan = user.plan
        token.isEmailVerified = user.isEmailVerified
      }

      // Handle session updates
      if (trigger === "update" && session) {
        token.name = session.user?.name
        token.email = session.user?.email
        token.picture = session.user?.image
      }

      // Refresh user data from database
      if (token.id) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: {
              role: true,
              plan: true,
              isEmailVerified: true,
              name: true,
              email: true,
              image: true,
            }
          })

          if (dbUser) {
            token.role = dbUser.role
            token.plan = dbUser.plan
            token.isEmailVerified = dbUser.isEmailVerified
            token.name = dbUser.name
            token.email = dbUser.email
            token.picture = dbUser.image
          }
        } catch (error) {
          console.error("JWT callback error:", error)
        }
      }

      return token
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string | undefined
        session.user.plan = token.plan as string | undefined
        session.user.isEmailVerified = token.isEmailVerified as boolean
        session.user.name = token.name as string
        session.user.email = token.email as string
        session.user.image = token.picture as string | undefined
      }

      return session
    },
  },
  events: {
    async createUser({ user }) {
      try {
        // Check if usage stats already exist
        if (!user.id) return

        const existingStats = await prisma.usageStats.findUnique({
          where: { userId: user.id }
        })

        if (!existingStats) {
          await prisma.usageStats.create({
            data: {
              userId: user.id,
              resumesLimit: 1,
              aiCreditsLimit: 10,
            }
          })
        }
      } catch (error) {
        console.error("CreateUser event error:", error)
      }
    },
    async linkAccount({ user }) {
      try {
        await prisma.user.update({
          where: { id: user.id },
          data: { isEmailVerified: true }
        })
      } catch (error) {
        console.error("LinkAccount event error:", error)
      }
    }
  },
  debug: process.env.NODE_ENV === "development",
})