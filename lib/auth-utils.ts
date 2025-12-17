// lib/auth-utils.ts
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { UserPlan, UserRole } from "./generated/prisma/enums"

/**
 * Get the current session or redirect to login
 */
export async function getServerSession() {
  const session = await auth()
  
  if (!session || !session.user) {
    redirect("/auth/sign-in")
  }
  
  return session
}

/**
 * Check if user has required role
 */
export async function requireRole(role: UserRole) {
  const session = await getServerSession()
  
  if (session.user.role !== role && session.user.role !== UserRole.ADMIN) {
    redirect("/dashboard")
  }
  
  return session
}

/**
 * Check if user has required plan
 */
export async function requirePlan(plan: UserPlan) {
  const session = await getServerSession()
  
  const planHierarchy = {
    [UserPlan.FREE]: 0,
    [UserPlan.PRO]: 1,
    [UserPlan.ENTERPRISE]: 2,
  }
  
  if (planHierarchy[session.user.plan as UserPlan] < planHierarchy[plan]) {
    redirect("/pricing")
  }
  
  return session
}

/**
 * Check if user is admin
 */
export async function requireAdmin() {
  return requireRole(UserRole.ADMIN)
}

/**
 * Get current user or null (no redirect)
 */
export async function getCurrentUser() {
  const session = await auth()
  return session?.user || null
}

/**
 * Check if email is verified
 */