// lib/permissions.ts
import { auth } from "@/lib/auth"
import prisma from "@/lib/db"
import type { UserRole, UserPlan } from "@/lib/generated/prisma/client"

// Plan limits configuration
export const PLAN_LIMITS = {
  FREE: {
    resumes: 1,
    aiCredits: 10,
    premiumTemplates: false,
    atsOptimization: false,
    customDomain: false,
    prioritySupport: false,
  },
  PRO: {
    resumes: -1, // unlimited
    aiCredits: 100,
    premiumTemplates: true,
    atsOptimization: true,
    customDomain: false,
    prioritySupport: true,
  },
  ENTERPRISE: {
    resumes: -1, // unlimited
    aiCredits: -1, // unlimited
    premiumTemplates: true,
    atsOptimization: true,
    customDomain: true,
    prioritySupport: true,
  },
} as const

// Get current user session
export async function getCurrentUser() {
  const session = await auth()
  return session?.user || null
}

// Check if user is authenticated
export async function isAuthenticated() {
  const session = await auth()
  return !!session?.user
}

// Check if user is admin
export async function isAdmin() {
  const session = await auth()
  return session?.user?.role === "ADMIN"
}

// Check if user has specific role
export async function hasRole(role: UserRole) {
  const session = await auth()
  return session?.user?.role === role
}

// Check if user has specific plan
export async function hasPlan(plan: UserPlan) {
  const session = await auth()
  return session?.user?.plan === plan
}

// Check if user can create more resumes
export async function canCreateResume(userId?: string) {
  const session = await auth()
  const targetUserId = userId || session?.user?.id

  if (!targetUserId) return false

  const stats = await prisma.usageStats.findUnique({
    where: { userId: targetUserId },
    select: { resumesCreated: true, resumesLimit: true },
  })

  if (!stats) return false

  // -1 means unlimited
  if (stats.resumesLimit === -1) return true

  return stats.resumesCreated < stats.resumesLimit
}

// Check if user has AI credits available
export async function hasAICreditsAvailable(userId?: string) {
  const session = await auth()
  const targetUserId = userId || session?.user?.id

  if (!targetUserId) return false

  const stats = await prisma.usageStats.findUnique({
    where: { userId: targetUserId },
    select: { aiCreditsUsed: true, aiCreditsLimit: true },
  })

  if (!stats) return false

  // -1 means unlimited
  if (stats.aiCreditsLimit === -1) return true

  return stats.aiCreditsUsed < stats.aiCreditsLimit
}

// Check if user can access premium templates
export async function canAccessPremiumTemplates() {
  const session = await auth()
  if (!session?.user) return false

  const plan = session.user.plan as UserPlan
  return PLAN_LIMITS[plan]?.premiumTemplates || false
}

// Get user's remaining AI credits
export async function getRemainingAICredits(userId?: string) {
  const session = await auth()
  const targetUserId = userId || session?.user?.id

  if (!targetUserId) return 0

  const stats = await prisma.usageStats.findUnique({
    where: { userId: targetUserId },
    select: { aiCreditsUsed: true, aiCreditsLimit: true },
  })

  if (!stats) return 0

  // -1 means unlimited
  if (stats.aiCreditsLimit === -1) return Infinity

  return Math.max(0, stats.aiCreditsLimit - stats.aiCreditsUsed)
}

// Get user's remaining resume slots
export async function getRemainingResumeSlots(userId?: string) {
  const session = await auth()
  const targetUserId = userId || session?.user?.id

  if (!targetUserId) return 0

  const stats = await prisma.usageStats.findUnique({
    where: { userId: targetUserId },
    select: { resumesCreated: true, resumesLimit: true },
  })

  if (!stats) return 0

  // -1 means unlimited
  if (stats.resumesLimit === -1) return Infinity

  return Math.max(0, stats.resumesLimit - stats.resumesCreated)
}

// Increment resume count
export async function incrementResumeCount(userId: string) {
  try {
    await prisma.usageStats.update({
      where: { userId },
      data: { resumesCreated: { increment: 1 } },
    })
    return true
  } catch (error) {
    console.error("Error incrementing resume count:", error)
    return false
  }
}

// Decrement resume count (when resume is deleted)
export async function decrementResumeCount(userId: string) {
  try {
    await prisma.usageStats.update({
      where: { userId },
      data: { resumesCreated: { decrement: 1 } },
    })
    return true
  } catch (error) {
    console.error("Error decrementing resume count:", error)
    return false
  }
}

// Use AI credits
export async function useAICredits(userId: string, credits: number = 1) {
  try {
    const stats = await prisma.usageStats.findUnique({
      where: { userId },
      select: { aiCreditsUsed: true, aiCreditsLimit: true },
    })

    if (!stats) return false

    // -1 means unlimited, so don't track usage
    if (stats.aiCreditsLimit === -1) return true

    // Check if user has enough credits
    if (stats.aiCreditsUsed + credits > stats.aiCreditsLimit) {
      return false
    }

    await prisma.usageStats.update({
      where: { userId },
      data: { aiCreditsUsed: { increment: credits } },
    })

    return true
  } catch (error) {
    console.error("Error using AI credits:", error)
    return false
  }
}

// Reset monthly AI credits (should be called by a cron job)
export async function resetMonthlyAICredits() {
  try {
    await prisma.usageStats.updateMany({
      data: {
        aiCreditsUsed: 0,
        lastResetAt: new Date(),
      },
    })
    return true
  } catch (error) {
    console.error("Error resetting monthly AI credits:", error)
    return false
  }
}

// Upgrade user plan
export async function upgradePlan(userId: string, newPlan: UserPlan) {
  try {
    await prisma.$transaction(async (tx) => {
      // Update user plan
      await tx.user.update({
        where: { id: userId },
        data: { plan: newPlan },
      })

      // Update usage limits based on new plan
      const limits = PLAN_LIMITS[newPlan]
      await tx.usageStats.update({
        where: { userId },
        data: {
          resumesLimit: limits.resumes,
          aiCreditsLimit: limits.aiCredits,
        },
      })

      // Log analytics event
      await tx.analytics.create({
        data: {
          eventType: "plan_upgraded",
          userId,
          metadata: {
            newPlan,
            timestamp: new Date().toISOString(),
          },
        },
      })
    })

    return true
  } catch (error) {
    console.error("Error upgrading plan:", error)
    return false
  }
}

// Check if user owns a resume
export async function ownsResume(resumeId: string, userId?: string) {
  const session = await auth()
  const targetUserId = userId || session?.user?.id

  if (!targetUserId) return false

  const resume = await prisma.resume.findUnique({
    where: { id: resumeId },
    select: { userId: true },
  })

  return resume?.userId === targetUserId
}

// Get user's full statistics
export async function getUserStats(userId?: string) {
  const session = await auth()
  const targetUserId = userId || session?.user?.id

  if (!targetUserId) return null

  const [user, stats, resumeCount, applicationCount] = await Promise.all([
    prisma.user.findUnique({
      where: { id: targetUserId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        plan: true,
        createdAt: true,
        lastLoginAt: true,
      },
    }),
    prisma.usageStats.findUnique({
      where: { userId: targetUserId },
    }),
    prisma.resume.count({
      where: { userId: targetUserId },
    }),
    prisma.jobApplication.count({
      where: { userId: targetUserId },
    }),
  ])

  return {
    user,
    stats,
    resumeCount,
    applicationCount,
  }
}