/* eslint-disable @typescript-eslint/no-explicit-any */
// __tests__/auth.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { auth } from '@/lib/auth'
import { 
  getServerSession, 
  requireRole, 
  requirePlan,
  requireAdmin,
  getCurrentUser,
  requireEmailVerified,
  hasMinimumPlan,
  isAuthenticated
} from '@/lib/auth-utils'
import { UserRole, UserPlan } from '@/lib/generated/prisma/enums'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: any) => {
    throw new Error(`REDIRECT: ${url}`)
  })
}))

// Mock auth
vi.mock('@/lib/auth', () => ({
  auth: vi.fn()
}))

describe('Authentication Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getServerSession', () => {
    it('should return session when user is authenticated', async () => {
      const mockSession = {
        user: {
          id: 'user-123',
          email: 'test@example.com',
          role: UserRole.USER,
          plan: UserPlan.FREE,
          isEmailVerified: true
        }
      }
      
      vi.mocked(auth).mockResolvedValue(mockSession as any)
      
      const session = await getServerSession()
      expect(session).toEqual(mockSession)
    })

    it('should redirect when no session exists', async () => {
      vi.mocked(auth).mockResolvedValue(null)
      
      await expect(getServerSession()).rejects.toThrow('REDIRECT: /auth/sign-in')
    })

    it('should redirect when user is missing', async () => {
      vi.mocked(auth).mockResolvedValue({ user: null } as any)
      
      await expect(getServerSession()).rejects.toThrow('REDIRECT: /auth/sign-in')
    })
  })

  describe('requireRole', () => {
    it('should allow access when user has required role', async () => {
      const mockSession = {
        user: {
          id: 'user-123',
          role: UserRole.ADMIN,
          plan: UserPlan.PRO,
          isEmailVerified: true
        }
      }
      
      vi.mocked(auth).mockResolvedValue(mockSession as any)
      
      const session = await requireRole(UserRole.ADMIN)
      expect(session).toEqual(mockSession)
    })

    it('should allow admin to access any role', async () => {
      const mockSession = {
        user: {
          id: 'user-123',
          role: UserRole.ADMIN,
          plan: UserPlan.PRO,
          isEmailVerified: true
        }
      }
      
      vi.mocked(auth).mockResolvedValue(mockSession as any)
      
      const session = await requireRole(UserRole.USER)
      expect(session).toEqual(mockSession)
    })

    it('should redirect when user lacks required role', async () => {
      const mockSession = {
        user: {
          id: 'user-123',
          role: UserRole.USER,
          plan: UserPlan.FREE,
          isEmailVerified: true
        }
      }
      
      vi.mocked(auth).mockResolvedValue(mockSession as any)
      
      await expect(requireRole(UserRole.ADMIN)).rejects.toThrow('REDIRECT: /dashboard')
    })
  })

  describe('requirePlan', () => {
    it('should allow access when user has required plan', async () => {
      const mockSession = {
        user: {
          id: 'user-123',
          role: UserRole.USER,
          plan: UserPlan.PRO,
          isEmailVerified: true
        }
      }
      
      vi.mocked(auth).mockResolvedValue(mockSession as any)
      
      const session = await requirePlan(UserPlan.PRO)
      expect(session).toEqual(mockSession)
    })

    it('should allow access when user has higher plan', async () => {
      const mockSession = {
        user: {
          id: 'user-123',
          role: UserRole.USER,
          plan: UserPlan.ENTERPRISE,
          isEmailVerified: true
        }
      }
      
      vi.mocked(auth).mockResolvedValue(mockSession as any)
      
      const session = await requirePlan(UserPlan.PRO)
      expect(session).toEqual(mockSession)
    })

    it('should redirect when user has lower plan', async () => {
      const mockSession = {
        user: {
          id: 'user-123',
          role: UserRole.USER,
          plan: UserPlan.FREE,
          isEmailVerified: true
        }
      }
      
      vi.mocked(auth).mockResolvedValue(mockSession as any)
      
      await expect(requirePlan(UserPlan.PRO)).rejects.toThrow('REDIRECT: /pricing')
    })
  })

  describe('getCurrentUser', () => {
    it('should return user when authenticated', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        role: UserRole.USER,
        plan: UserPlan.FREE,
        isEmailVerified: true
      }
      
      vi.mocked(auth).mockResolvedValue({ user: mockUser } as any)
      
      const user = await getCurrentUser()
      expect(user).toEqual(mockUser)
    })

    it('should return null when not authenticated', async () => {
      vi.mocked(auth).mockResolvedValue(null)
      
      const user = await getCurrentUser()
      expect(user).toBeNull()
    })
  })

  describe('requireEmailVerified', () => {
    it('should allow access when email is verified', async () => {
      const mockSession = {
        user: {
          id: 'user-123',
          role: UserRole.USER,
          plan: UserPlan.FREE,
          isEmailVerified: true
        }
      }
      
      vi.mocked(auth).mockResolvedValue(mockSession as any)
      
      const session = await requireEmailVerified()
      expect(session).toEqual(mockSession)
    })

    it('should redirect when email is not verified', async () => {
      const mockSession = {
        user: {
          id: 'user-123',
          role: UserRole.USER,
          plan: UserPlan.FREE,
          isEmailVerified: false
        }
      }
      
      vi.mocked(auth).mockResolvedValue(mockSession as any)
      
      await expect(requireEmailVerified()).rejects.toThrow('REDIRECT: /auth/verify-email')
    })
  })

  describe('hasMinimumPlan', () => {
    it('should return true when user has minimum plan', async () => {
      vi.mocked(auth).mockResolvedValue({
        user: { plan: UserPlan.PRO }
      } as any)
      
      const result = await hasMinimumPlan(UserPlan.FREE)
      expect(result).toBe(true)
    })

    it('should return false when user has lower plan', async () => {
      vi.mocked(auth).mockResolvedValue({
        user: { plan: UserPlan.FREE }
      } as any)
      
      const result = await hasMinimumPlan(UserPlan.PRO)
      expect(result).toBe(false)
    })

    it('should return false when no session', async () => {
      vi.mocked(auth).mockResolvedValue(null)
      
      const result = await hasMinimumPlan(UserPlan.PRO)
      expect(result).toBe(false)
    })
  })

  describe('isAuthenticated', () => {
    it('should return true when user is authenticated', async () => {
      vi.mocked(auth).mockResolvedValue({
        user: { id: 'user-123' }
      } as any)
      
      const result = await isAuthenticated()
      expect(result).toBe(true)
    })

    it('should return false when not authenticated', async () => {
      vi.mocked(auth).mockResolvedValue(null)
      
      const result = await isAuthenticated()
      expect(result).toBe(false)
    })
  })
})