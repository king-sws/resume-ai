// components/auth/SignInForm.tsx
'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SignInWithCredentials } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, Loader2, Mail, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { OAuthProviders } from './OAuthProviders'

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

type SignInFormData = z.infer<typeof signInSchema>

export function SignInForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string>('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  })

  const onSubmit = async (data: SignInFormData) => {
    setError('')

    startTransition(async () => {
      const result = await SignInWithCredentials(data.email, data.password)
      
      if (result.success) {
        toast.success('Signed in successfully!')
        // Force a page refresh and redirect to dashboard
        window.location.href = '/dashboard'
      } else if (result.error) {
        setError(result.error)
      }
    })
  }

  const isLoading = isPending || isSubmitting

  return (
    <div className="space-y-6">
      {/* OAuth Providers */}
      <OAuthProviders />

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[#0a0a0a] px-2 text-gray-500">Or continue with email</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <Alert variant="destructive" className="text-sm bg-red-500/10 border-red-500/20 text-red-400">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-300">
            Email address
          </Label>
          <div className="relative">
            <Input
              {...register('email')}
              id="email"
              type="email"
              placeholder="you@company.com"
              className="pl-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:bg-white/10 focus:border-white/20"
              disabled={isLoading}
            />
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
          </div>
          {errors.email && (
            <p className="text-xs text-red-400">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="password" className="text-sm font-medium text-gray-300">
              Password
            </Label>
            <Link
              href="/auth/forgot-password"
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              {...register('password')}
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              className="pl-10 pr-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:bg-white/10 focus:border-white/20"
              disabled={isLoading}
            />
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-300 transition-colors"
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-400">{errors.password.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-11 bg-white text-black hover:bg-gray-200 font-medium transition-colors"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </Button>
      </form>

      {/* Sign up link */}
      <div className="text-center text-sm text-gray-400">
        Don&#39;t have an account?{' '}
        <Link
          href="/auth/sign-up"
          className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
        >
          Sign up for free
        </Link>
      </div>
    </div>
  )
}