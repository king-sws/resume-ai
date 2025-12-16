// components/admin/AdminTemplateCard.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Edit, Trash2, Eye, Crown, MoreVertical } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Template {
  id: string
  name: string
  category: string
  thumbnail: string | null
  isPremium: boolean
  isActive: boolean
  usageCount: number
}

interface AdminTemplateCardProps {
  template: Template
}

export function AdminTemplateCard({ template }: AdminTemplateCardProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this template?')) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/templates/${template.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete')

      router.refresh()
    } catch (error) {
      alert('Failed to delete template')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleToggleActive = async () => {
    try {
      const response = await fetch(`/api/admin/templates/${template.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !template.isActive }),
      })

      if (!response.ok) throw new Error('Failed to update')

      router.refresh()
    } catch (error) {
      alert('Failed to update template')
    }
  }

  return (
    <div className="group relative rounded-xl bg-white/5 border border-white/10 hover:border-white/20 overflow-hidden transition-all">
      {/* Template Preview */}
      <div className="aspect-[3/4] relative bg-gray-900">
        {template.thumbnail ? (
          <img
            src={template.thumbnail}
            alt={template.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Eye className="w-12 h-12 text-gray-600" />
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Link href={`/admin/templates/${template.id}/edit`}>
            <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm">
              <Edit className="w-5 h-5 text-white" />
            </button>
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 rounded-lg bg-white/10 hover:bg-red-500/20 backdrop-blur-sm"
          >
            <Trash2 className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-2">
          {template.isPremium && (
            <span className="px-2 py-1 rounded-full bg-gradient-to-r from-[#50a3f8] to-[#2fabb8] text-xs font-semibold text-white flex items-center gap-1">
              <Crown className="w-3 h-3" />
              Pro
            </span>
          )}
          {!template.isActive && (
            <span className="px-2 py-1 rounded-full bg-red-500/20 text-xs font-semibold text-red-400 border border-red-500/30">
              Inactive
            </span>
          )}
        </div>

        {/* Menu */}
        <div className="absolute top-2 right-2">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-lg bg-black/50 hover:bg-black/70 backdrop-blur-sm"
          >
            <MoreVertical className="w-4 h-4 text-white" />
          </button>
          
          {showMenu && (
            <div className="absolute top-full right-0 mt-2 w-48 rounded-lg bg-[#1a1a1a] border border-white/10 shadow-xl overflow-hidden z-10">
              <button
                onClick={handleToggleActive}
                className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/5"
              >
                {template.isActive ? 'Deactivate' : 'Activate'}
              </button>
              <Link href={`/admin/templates/${template.id}/edit`}>
                <button className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/5">
                  Edit
                </button>
              </Link>
              <button
                onClick={handleDelete}
                className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-1 truncate">
          {template.name}
        </h3>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">{template.category}</span>
          <span className="text-gray-400">{template.usageCount} uses</span>
        </div>
      </div>
    </div>
  )
}