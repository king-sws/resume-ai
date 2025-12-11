// components/settings/ProfileSettings.tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Mail, Loader2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
})

type ProfileFormData = z.infer<typeof profileSchema>

interface ProfileSettingsProps {
  user: {
    name: string | null
    email: string
    image: string | null
  }
}

export function ProfileSettings({ user }: ProfileSettingsProps) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || '',
      email: user.email,
    },
  })

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/user/update-profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to update profile')

      toast.success('Profile updated successfully')
      
      // Refresh the page to show updated data
      window.location.reload()
    } catch (error) {
      toast.error('Failed to update profile')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const userInitials = user.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || user.email[0].toUpperCase()

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <User className="w-5 h-5 text-slate-600" />
        <h2 className="text-xl font-semibold text-slate-900">Profile Information</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Avatar */}
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.image || undefined} alt={user.name || 'User'} />
            <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-2xl">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div>
            <Button variant="outline" size="sm" disabled>
              Change Avatar
            </Button>
            <p className="text-xs text-slate-500 mt-1">
              Coming soon
            </p>
          </div>
        </div>

        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            {...register('name')}
            id="name"
            type="text"
            placeholder="John Doe"
            disabled={isLoading}
          />
          {errors.name && (
            <p className="text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            {...register('email')}
            id="email"
            type="email"
            placeholder="you@company.com"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-xs text-red-600">{errors.email.message}</p>
          )}
          <p className="text-xs text-slate-500">
            Your email is used for sign-in and notifications
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={!isDirty || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}