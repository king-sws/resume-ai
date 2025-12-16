// components/auth/SignUpForm.tsx
'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SignUpWithCredentials } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, Loader2, User, Mail, Lock, Check, X } from 'lucide-react'
import { toast } from 'sonner'
import { OAuthProviders } from './OAuthProviders'

const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
      'Password must contain uppercase, lowercase, and number'),
  terms: z.boolean().refine(val => val === true, 'You must accept the terms'),
})

type SignUpFormData = z.infer<typeof signUpSchema>

const PasswordStrength = ({ password }: { password: string }) => {
  const requirements = [
    { label: 'At least 8 characters', test: password.length >= 8 },
    { label: 'One uppercase letter', test: /[A-Z]/.test(password) },
    { label: 'One lowercase letter', test: /[a-z]/.test(password) },
    { label: 'One number', test: /\d/.test(password) },
  ]

  if (!password) return null

  return (
    <div className="mt-2 space-y-1">
      {requirements.map((req, index) => (
        <div key={index} className="flex items-center space-x-2 text-xs">
          {req.test ? (
            <Check className="w-3 h-3 text-green-400" />
          ) : (
            <X className="w-3 h-3 text-gray-600" />
          )}
          <span className={req.test ? 'text-green-400' : 'text-gray-500'}>
            {req.label}
          </span>
        </div>
      ))}
    </div>
  )
}

export function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  })

  const password = watch('password', '')

  const onSubmit = async (data: SignUpFormData) => {
    setError('')
    setSuccess('')
    
    startTransition(async () => {
      const result = await SignUpWithCredentials(data.name, data.email, data.password)
      
      if (result.success) {
        setSuccess('Account created successfully!')
        toast.success('Account created successfully!')
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
          <span className="bg-[#0a0a0a] px-2 text-gray-500">Or create account with email</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <Alert variant="destructive" className="text-sm bg-red-500/10 border-red-500/20 text-red-400">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="text-sm border-green-500/20 bg-green-500/10">
            <Check className="h-4 w-4 text-green-400" />
            <AlertDescription className="text-green-400">{success}</AlertDescription>
          </Alert>
        )}

        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium text-gray-300">
            Full name
          </Label>
          <div className="relative">
            <Input
              {...register('name')}
              id="name"
              type="text"
              placeholder="John Doe"
              className="pl-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:bg-white/10 focus:border-white/20"
              disabled={isLoading}
            />
            <User className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
          </div>
          {errors.name && (
            <p className="text-xs text-red-400">{errors.name.message}</p>
          )}
        </div>

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
          <Label htmlFor="password" className="text-sm font-medium text-gray-300">
            Password
          </Label>
          <div className="relative">
            <Input
              {...register('password')}
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a strong password"
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
          <PasswordStrength password={password} />
          {errors.password && (
            <p className="text-xs text-red-400">{errors.password.message}</p>
          )}
        </div>

        {/* Terms Checkbox */}
        <div className="flex items-start space-x-2">
          <input
            {...register('terms')}
            id="terms"
            type="checkbox"
            className="mt-1 h-4 w-4 text-blue-500 focus:ring-blue-500 bg-white/5 border-white/10 rounded"
            disabled={isLoading}
          />
          <Label htmlFor="terms" className="text-xs text-gray-400 leading-relaxed">
            I agree to the{' '}
            <Link href="/terms" className="text-blue-400 hover:text-blue-300 transition-colors">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-blue-400 hover:text-blue-300 transition-colors">
              Privacy Policy
            </Link>
          </Label>
        </div>
        {errors.terms && (
          <p className="text-xs text-red-400">{errors.terms.message}</p>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-11 bg-white text-black hover:bg-gray-200 font-medium transition-colors"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating account...
            </>
          ) : (
            'Create account'
          )}
        </Button>
      </form>

      {/* Sign in link */}
      <div className="text-center text-sm text-gray-400">
        Already have an account?{' '}
        <Link
          href="/auth/sign-in"
          className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
        >
          Sign in
        </Link>
      </div>
    </div>
  )
}