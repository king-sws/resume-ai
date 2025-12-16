// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"
import type { UserRole, UserPlan } from "@/lib/generated/prisma/client"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: UserRole
      plan: UserPlan
      email: string
      name: string | null
      image: string | null
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    role: UserRole
    plan?: UserPlan
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string
    role: UserRole
    plan: UserPlan
  }
}