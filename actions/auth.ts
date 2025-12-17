/* eslint-disable @typescript-eslint/no-explicit-any */
// actions/auth.ts
"use server";

import { signIn, signOut } from "@/lib/auth";
import { SendWelcomeEmail } from "@/nodemailer/email";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";
import prisma from "@/lib/db";

// -------------------------
// Validation Schemas
// -------------------------
const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
      "Password must contain at least one lowercase letter, one uppercase letter, and one number"),
});

// -------------------------
// Types
// -------------------------
type AuthResult = {
  success: boolean;
  userId?: string | null;
  error?: string;
  message?: string;
};

// Simple rate limiting (consider using Redis in production)
const attempts = new Map<string, { count: number; resetTime: number }>();

const rateLimit = (key: string, maxAttempts: number, windowMs: number): boolean => {
  const now = Date.now();
  const record = attempts.get(key);

  if (!record || now > record.resetTime) {
    attempts.set(key, { count: 1, resetTime: now + windowMs });
    return false;
  }

  if (record.count >= maxAttempts) {
    return true; // Rate limited
  }

  record.count++;
  return false;
};

// -------------------------
// Sign in with credentials
// -------------------------
export const SignInWithCredentials = async (
  email: string,
  password: string
): Promise<AuthResult> => {
  try {
    // Validate input
    const validated = signInSchema.parse({ email, password });

    // Rate limiting
    const rateLimited = rateLimit(`signin:${email}`, 5, 15 * 60 * 1000); // 5 attempts per 15 min
    if (rateLimited) {
      return {
        success: false,
        error: "Too many sign-in attempts. Please try again later.",
      };
    }

    // Attempt sign in with proper redirect
    const result = await signIn("credentials", {
      email: validated.email,
      password: validated.password,
      redirect: false,
    });

    if (result?.error) {
      // Handle specific NextAuth errors
      if (result.error === "CredentialsSignin") {
        return {
          success: false,
          error: "Invalid email or password",
        };
      }
      return {
        success: false,
        error: "Authentication failed",
      };
    }

    // Log analytics event
    const user = await prisma.user.findUnique({
      where: { email: validated.email },
      select: { id: true }
    });

    if (user) {
      await prisma.analytics.create({
        data: {
          eventType: "user_login",
          userId: user.id,
          metadata: {
            provider: "credentials",
          }
        }
      }).catch(() => {
        // Silently fail if analytics doesn't work
      });
    }

    // If we get here, sign in was successful
    return { 
      success: true,
      message: "Successfully signed in!"
    };

  } catch (error) {
    console.error("Sign-in error:", error);
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Invalid input",
      };
    }

    if (error) {
      return {
        success: false,
        error: "Authentication failed. Please check your credentials.",
      };
    }

    return { 
      success: false, 
      error: "An unexpected error occurred. Please try again." 
    };
  }
};

// -------------------------
// Sign up with credentials
// -------------------------
export const SignUpWithCredentials = async (
  name: string,
  email: string,
  password: string
): Promise<AuthResult> => {
  try {
    // Validate input
    const validated = signUpSchema.parse({ name, email, password });

    // Rate limiting
    const rateLimited = rateLimit(`signup:${email}`, 3, 60 * 60 * 1000); // 3 attempts per hour
    if (rateLimited) {
      return {
        success: false,
        error: "Too many registration attempts. Please try again later.",
      };
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      return { 
        success: false, 
        error: "An account with this email already exists" 
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validated.password, 12);

    // Create user with usage stats in transaction
    const user = await prisma.$transaction(async (tx) => {
      // Create user
      const newUser = await tx.user.create({
        data: {
          email: validated.email,
          name: validated.name,
          password: hashedPassword,
          role: "USER",
          plan: "FREE",
          emailVerified: new Date(),
          isEmailVerified: true,
          lastLoginAt: new Date(),
        },
      });

      // Create usage stats for new user
      await tx.usageStats.create({
        data: {
          userId: newUser.id,
          resumesCreated: 0,
          resumesLimit: 1, // FREE plan: 1 resume
          aiCreditsUsed: 0,
          aiCreditsLimit: 10, // FREE plan: 10 AI credits per month
          premiumTemplatesUsed: false,
          totalViews: 0,
          totalDownloads: 0,
        }
      });

      // Log analytics event
      await tx.analytics.create({
        data: {
          eventType: "user_registered",
          userId: newUser.id,
          metadata: {
            provider: "credentials",
            plan: "FREE",
          }
        }
      }).catch(() => {
        // Silently fail if analytics doesn't work
      });

      return newUser;
    });

    // Send welcome email (don't await to avoid blocking)
    SendWelcomeEmail(validated.email, validated.name).catch((error: any) => {
      console.error("Failed to send welcome email:", error);
    });

    // Auto sign-in the user after successful registration
    try {
      const signInResult = await signIn("credentials", {
        email: validated.email,
        password: validated.password,
        redirect: false,
      });

      if (signInResult?.error) {
        // Account created but auto sign-in failed
        return {
          success: true,
          userId: user.id,
          message: "Account created successfully! Please sign in with your credentials.",
        };
      }

      // Both account creation and sign-in successful
      return {
        success: true,
        userId: user.id,
        message: "Account created and signed in successfully!",
      };

    } catch (signInError) {
      console.error("Auto sign-in error:", signInError);
      // Account created but auto sign-in failed
      return {
        success: true,
        userId: user.id,
        message: "Account created successfully! Please sign in with your credentials.",
      };
    }

  } catch (error) {
    console.error("Sign-up error:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Invalid input",
      };
    }

    // Handle Prisma unique constraint errors
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return {
        success: false,
        error: "An account with this email already exists",
      };
    }

    return { 
      success: false, 
      error: "Failed to create account. Please try again." 
    };
  }
};

// -------------------------
// Sign out
// -------------------------
export const SignOut = async (): Promise<void> => {
  try {
    await signOut({ redirectTo: "/" });
  } catch (error) {
    console.error("Sign-out error:", error);
    // Force redirect even if signOut fails
    redirect("/");
  }
};

// -------------------------
// Server Actions for Direct Redirects
// -------------------------
export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const result = await SignInWithCredentials(email, password);
  
  if (result.success) {
    redirect("/dashboard");
  }
  
  // If there's an error, we'll handle it in the component
  throw new Error(result.error || "Authentication failed");
};

export const signUpAction = async (formData: FormData) => {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const result = await SignUpWithCredentials(name, email, password);
  
  if (result.success) {
    redirect("/dashboard");
  }
  
  // If there's an error, we'll handle it in the component
  throw new Error(result.error || "Registration failed");
};

// -------------------------
// Utility: Check if email exists (for forms)
// -------------------------
export const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    return !!user;
  } catch {
    return false;
  }
};

// -------------------------
// Utility: Get user usage stats
// -------------------------
export const getUserUsageStats = async (userId: string) => {
  try {
    const stats = await prisma.usageStats.findUnique({
      where: { userId },
      select: {
        resumesCreated: true,
        resumesLimit: true,
        aiCreditsUsed: true,
        aiCreditsLimit: true,
        premiumTemplatesUsed: true,
        totalViews: true,
        totalDownloads: true,
      }
    });

    return stats;
  } catch (error) {
    console.error("Error fetching usage stats:", error);
    return null;
  }
};

// -------------------------
// Utility: Check if user can create resume
// -------------------------
export const canCreateResume = async (userId: string): Promise<boolean> => {
  try {
    const stats = await prisma.usageStats.findUnique({
      where: { userId },
      select: {
        resumesCreated: true,
        resumesLimit: true,
      }
    });

    if (!stats) return false;

    // -1 means unlimited (PRO plan)
    if (stats.resumesLimit === -1) return true;

    return stats.resumesCreated < stats.resumesLimit;
  } catch {
    return false;
  }
};

// -------------------------
// Utility: Check if user has AI credits
// -------------------------
export const hasAICredits = async (userId: string): Promise<boolean> => {
  try {
    const stats = await prisma.usageStats.findUnique({
      where: { userId },
      select: {
        aiCreditsUsed: true,
        aiCreditsLimit: true,
      }
    });

    if (!stats) return false;

    // -1 means unlimited (PRO plan)
    if (stats.aiCreditsLimit === -1) return true;

    return stats.aiCreditsUsed < stats.aiCreditsLimit;
  } catch {
    return false;
  }
};