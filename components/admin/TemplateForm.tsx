// components/admin/TemplateForm.tsx
'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Loader2, Upload, X, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'

interface TemplateFormProps {
  initialData?: any
  templateId?: string
}

export function TemplateForm({ initialData, templateId }: TemplateFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.thumbnail || null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(initialData?.thumbnail || null)

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    category: initialData?.category || 'MODERN',
    isPremium: initialData?.isPremium || false,
    isActive: initialData?.isActive ?? true,
    previewUrl: initialData?.previewUrl || '',
  })

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (PNG, JPG, or WebP)')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB')
      return
    }

    setError(null)
    setUploadingImage(true)

    try {
      // Create preview immediately
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      // Upload to server
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      })

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json()
        throw new Error(errorData.error || 'Failed to upload image')
      }

      const { url } = await uploadResponse.json()
      setUploadedImageUrl(url)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image')
      setImagePreview(null)
      setUploadedImageUrl(null)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
    setUploadedImageUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!uploadedImageUrl) {
      setError('Please upload a template thumbnail image')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const endpoint = templateId 
        ? `/api/admin/templates/${templateId}`
        : '/api/admin/templates'
      
      const method = templateId ? 'PUT' : 'POST'

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          thumbnail: uploadedImageUrl,
          structure: {
            layout: 'single-column',
            colors: {
              primary: '#3B82F6',
              secondary: '#10B981',
              text: '#1F2937',
              background: '#FFFFFF',
            },
            fonts: {
              heading: 'Poppins',
              body: 'Inter',
              sizes: { name: 32, heading: 18, body: 14 }
            },
            sections: {
              order: ['header', 'summary', 'experience', 'education', 'skills'],
              spacing: { section: 24, item: 16 }
            },
            margins: { top: 40, right: 40, bottom: 40, left: 40 }
          },
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save template')
      }

      router.push('/admin/templates')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save template')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Info */}
      <div className="rounded-xl bg-white/5 border border-white/10 p-6 space-y-6">
        <h2 className="text-xl font-semibold text-white">Basic Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Template Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#50a3f8]"
              placeholder="Modern Professional"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#50a3f8]"
            >
              <option value="MODERN">Modern</option>
              <option value="CLASSIC">Classic</option>
              <option value="CREATIVE">Creative</option>
              <option value="MINIMALIST">Minimalist</option>
              <option value="PROFESSIONAL">Professional</option>
              <option value="TECHNICAL">Technical</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-white mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#50a3f8] resize-none"
              placeholder="A modern, professional template perfect for..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Preview URL (Optional)
            </label>
            <input
              type="url"
              value={formData.previewUrl}
              onChange={(e) => setFormData({ ...formData, previewUrl: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#50a3f8]"
              placeholder="https://..."
            />
          </div>
        </div>
      </div>

      {/* Template Image Upload */}
      <div className="rounded-xl bg-white/5 border border-white/10 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Template Thumbnail *</h2>
          {uploadingImage && (
            <span className="text-sm text-[#50a3f8] flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Uploading...
            </span>
          )}
        </div>

        <div className="space-y-4">
          {/* Upload Area */}
          <div
            onClick={() => !uploadingImage && fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-xl p-8 transition-colors ${
              uploadingImage 
                ? 'border-white/10 cursor-wait' 
                : 'border-white/20 hover:border-[#50a3f8] cursor-pointer'
            } group`}
          >
            {imagePreview ? (
              <div className="relative">
                <div className="relative w-full max-w-md mx-auto aspect-[3/4] rounded-lg overflow-hidden bg-gray-900">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-contain"
                  />
                </div>
                {!uploadingImage && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveImage()
                    }}
                    className="absolute top-2 right-2 p-2 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg z-10"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
                {uploadedImageUrl && (
                  <div className="mt-4 p-3 rounded-lg bg-[#10b981]/10 border border-[#10b981]/20">
                    <p className="text-sm text-[#10b981] font-medium flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Image uploaded successfully!
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center">
                <div className="inline-flex p-4 rounded-full bg-white/5 mb-4 group-hover:bg-[#50a3f8]/10 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 group-hover:text-[#50a3f8]" />
                </div>
                <p className="text-white font-medium mb-2">
                  Click to upload template thumbnail
                </p>
                <p className="text-sm text-gray-400">
                  PNG, JPG or WebP (max 5MB)
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Recommended: 800x1200px (3:4 ratio)
                </p>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={handleImageSelect}
            disabled={uploadingImage}
            className="hidden"
          />

          {/* Guidelines */}
          <div className="p-4 rounded-lg bg-[#50a3f8]/10 border border-[#50a3f8]/20">
            <div className="flex gap-3">
              <ImageIcon className="w-5 h-5 text-[#50a3f8] shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="text-sm font-medium text-white">Image Guidelines:</p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• High-quality screenshot of the resume template</li>
                  <li>• Aspect ratio: 3:4 (portrait orientation)</li>
                  <li>• Show complete resume layout with sample content</li>
                  <li>• Ensure text is clearly readable</li>
                  <li>• Professional sample data recommended</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="rounded-xl bg-white/5 border border-white/10 p-6 space-y-6">
        <h2 className="text-xl font-semibold text-white">Settings</h2>

        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isPremium}
              onChange={(e) => setFormData({ ...formData, isPremium: e.target.checked })}
              className="w-5 h-5 rounded bg-white/5 border-white/10 text-[#50a3f8] focus:ring-2 focus:ring-[#50a3f8]"
            />
            <div>
              <span className="text-white font-medium">Premium Template</span>
              <p className="text-sm text-gray-400">Only available to Pro users</p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-5 h-5 rounded bg-white/5 border-white/10 text-[#50a3f8] focus:ring-2 focus:ring-[#50a3f8]"
            />
            <div>
              <span className="text-white font-medium">Active</span>
              <p className="text-sm text-gray-400">Template visible to users</p>
            </div>
          </label>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Link href="/admin/templates">
          <Button
            type="button"
            variant="outline"
            className="border-white/10 text-gray-400 hover:bg-white/5"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </Link>

        <Button
          type="submit"
          disabled={loading || uploadingImage || !uploadedImageUrl}
          className="bg-gradient-to-r from-[#50a3f8] to-[#2fabb8] hover:opacity-90 text-white disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              {templateId ? 'Update' : 'Create'} Template
            </>
          )}
        </Button>
      </div>
    </form>
  )
}