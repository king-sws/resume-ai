// components/settings/ProfileSettings.tsx
'use client'

import { useState, useRef } from 'react'
import { Save, Loader2, Upload, Camera, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface ProfileSettingsProps {
  user: {
    id: string
    name: string | null
    email: string
    image: string | null
  }
}

export function ProfileSettings({ user }: ProfileSettingsProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    name: user.name || '',
  })
  
  const [profileImage, setProfileImage] = useState<string | null>(user.image)

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, or WebP)')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB')
      return
    }

    setError(null)
    setUploadingImage(true)

    try {
      // Create local preview immediately
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)

      // Upload to server (which saves to database)
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)

      const uploadResponse = await fetch('/api/upload-profile', {
        method: 'POST',
        body: uploadFormData,
      })

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json()
        throw new Error(errorData.error || 'Failed to upload image')
      }

      const { url } = await uploadResponse.json()
      setProfileImage(url)
      
      // Show brief success message
      const tempSuccess = success
      setSuccess(true)
      setTimeout(() => setSuccess(tempSuccess), 2000)
      
      // Refresh to show updated image
      router.refresh()
      
    } catch (err) {
      console.error('Image upload error:', err)
      setError(err instanceof Error ? err.message : 'Failed to upload image')
      // Restore original image on error
      setProfileImage(user.image)
    } finally {
      setUploadingImage(false)
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveImage = async () => {
    setUploadingImage(true)
    setError(null)

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: null,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to remove image')
      }

      setProfileImage(null)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove image')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update profile')
      }

      setSuccess(true)
      router.refresh()
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Profile update error:', err)
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const getUserInitials = () => {
    if (user.name) {
      return user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    return user.email[0].toUpperCase()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile Picture */}
      <div className="p-6 rounded-xl bg-white/5 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Profile Picture</h3>
        
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-[#50a3f8] to-[#2fabb8] flex items-center justify-center">
              {profileImage ? (
                <Image
                  src={profileImage}
                  alt="Profile"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                  unoptimized // Since we're using base64
                />
              ) : (
                <span className="text-3xl font-bold text-white">
                  {getUserInitials()}
                </span>
              )}
            </div>
            
            {/* Upload overlay */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingImage}
              className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:cursor-not-allowed"
            >
              {uploadingImage ? (
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              ) : (
                <Camera className="w-6 h-6 text-white" />
              )}
            </button>

            {/* Remove button */}
            {profileImage && !uploadingImage && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            )}
          </div>

          <div className="flex-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/jpg"
              onChange={handleImageSelect}
              disabled={uploadingImage}
              className="hidden"
            />
            
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                variant="outline"
                className="border-white/10 text-gray-400 hover:bg-white/5"
              >
                <Upload className="w-4 h-4 mr-2" />
                {uploadingImage ? 'Uploading...' : 'Change Picture'}
              </Button>

              {profileImage && (
                <Button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={uploadingImage}
                  variant="outline"
                  className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                >
                  Remove
                </Button>
              )}
            </div>
            
            <p className="text-sm text-gray-400 mt-2">
              JPG, PNG or WebP. Max size 5MB.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Image is stored securely in the database
            </p>
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <div className="p-6 rounded-xl bg-white/5 border border-white/10 space-y-6">
        <h3 className="text-lg font-semibold text-white">Basic Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Full Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#50a3f8]"
              placeholder="John Doe"
              required
              minLength={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Email
            </label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-400 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3">
          <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-400">Error</p>
            <p className="text-sm text-red-300 mt-1">{error}</p>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-lg bg-[#10b981]/10 border border-[#10b981]/20 flex items-center gap-3">
          <div className="w-5 h-5 rounded-full bg-[#10b981]/20 flex items-center justify-center flex-shrink-0">
            <div className="w-2 h-2 rounded-full bg-[#10b981]" />
          </div>
          <p className="text-sm text-[#10b981]">Profile updated successfully!</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          onClick={() => router.back()}
          variant="outline"
          className="border-white/10 text-gray-400 hover:bg-white/5"
          disabled={loading || uploadingImage}
        >
          Cancel
        </Button>
        
        <Button
          type="submit"
          disabled={loading || uploadingImage || !formData.name.trim()}
          className="bg-gradient-to-r from-[#50a3f8] to-[#2fabb8] hover:opacity-90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  )
}