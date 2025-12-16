/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/admin/AdminTemplateManager.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2, Eye, EyeOff, Crown } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { TemplateForm } from './TemplateForm'
import Image from 'next/image'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface Template {
  id: string
  name: string
  description: string | null
  category: string
  thumbnail: string | null
  previewUrl: string | null
  isPremium: boolean
  isActive: boolean
  usageCount: number
  structure: any
  createdAt: Date
  updatedAt: Date
}

interface AdminTemplateManagerProps {
  initialTemplates: Template[]
}

export function AdminTemplateManager({ initialTemplates }: AdminTemplateManagerProps) {
  const router = useRouter()
  const [templates, setTemplates] = useState<Template[]>(initialTemplates)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingTemplate, setDeletingTemplate] = useState<Template | null>(null)

  const handleCreate = () => {
    setEditingTemplate(null)
    setIsFormOpen(true)
  }

  const handleEdit = (template: Template) => {
    setEditingTemplate(template)
    setIsFormOpen(true)
  }

  const handleDelete = async () => {
    if (!deletingTemplate) return

    try {
      const response = await fetch(`/api/admin/templates/${deletingTemplate.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete template')

      toast.success('Template deleted successfully')
      setTemplates(templates.filter(t => t.id !== deletingTemplate.id))
      setDeleteDialogOpen(false)
      setDeletingTemplate(null)
      router.refresh()
    } catch (error) {
      toast.error('Failed to delete template')
      console.error(error)
    }
  }

  const handleToggleActive = async (template: Template) => {
    try {
      const response = await fetch(`/api/admin/templates/${template.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !template.isActive }),
      })

      if (!response.ok) throw new Error('Failed to update template')

      const { template: updatedTemplate } = await response.json()
      setTemplates(templates.map(t => t.id === template.id ? updatedTemplate : t))
      toast.success(updatedTemplate.isActive ? 'Template activated' : 'Template deactivated')
      router.refresh()
    } catch (error) {
      toast.error('Failed to update template')
      console.error(error)
    }
  }

  const handleFormSuccess = (template: Template) => {
    if (editingTemplate) {
      setTemplates(templates.map(t => t.id === template.id ? template : t))
      toast.success('Template updated successfully')
    } else {
      setTemplates([template, ...templates])
      toast.success('Template created successfully')
    }
    setIsFormOpen(false)
    setEditingTemplate(null)
    router.refresh()
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-white">
              All Templates ({templates.length})
            </h2>
            <p className="text-sm text-[#7e7e7e]">
              {templates.filter(t => t.isActive).length} active • {templates.filter(t => !t.isActive).length} inactive
            </p>
          </div>
          <Button
            onClick={handleCreate}
            className="bg-[#50a3f8] hover:bg-[#3d8dd9] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Template
          </Button>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className="rounded-xl border border-[#2a2b2b] bg-[#242525] overflow-hidden"
            >
              {/* Preview */}
              <div className="aspect-[8.5/11] bg-[#1a1b1b] relative">
                {template.thumbnail ? (
                  <Image
                    src={template.thumbnail}
                    alt={template.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#7e7e7e]">
                    No preview
                  </div>
                )}
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {template.isPremium && (
                    <span className="px-2 py-1 rounded-full bg-[#50a3f8] text-white text-xs font-bold flex items-center gap-1">
                      <Crown className="w-3 h-3" />
                      PRO
                    </span>
                  )}
                  {!template.isActive && (
                    <span className="px-2 py-1 rounded-full bg-[#ff4444] text-white text-xs font-bold">
                      Inactive
                    </span>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-white mb-1">{template.name}</h3>
                  <p className="text-sm text-[#7e7e7e] line-clamp-2">
                    {template.description || 'No description'}
                  </p>
                </div>

                {/* Meta */}
                <div className="flex items-center justify-between text-xs text-[#7e7e7e]">
                  <span className="px-2 py-1 rounded bg-[#2a2b2b]">
                    {template.category}
                  </span>
                  <span>{template.usageCount} uses</span>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#2a2b2b]">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(template)}
                    className="border-[#2a2b2b] text-[#9ca3af] hover:text-white hover:bg-[#2a2b2b]"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleActive(template)}
                    className="border-[#2a2b2b] text-[#9ca3af] hover:text-white hover:bg-[#2a2b2b]"
                  >
                    {template.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setDeletingTemplate(template)
                      setDeleteDialogOpen(true)
                    }}
                    className="border-[#ff444430] text-[#ff4444] hover:bg-[#ff444410]"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {templates.length === 0 && (
          <div className="rounded-xl border border-[#2a2b2b] bg-[#242525] p-12 text-center">
            <p className="text-[#7e7e7e] mb-4">No templates yet</p>
            <Button onClick={handleCreate} className="bg-[#50a3f8] hover:bg-[#3d8dd9] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create First Template
            </Button>
          </div>
        )}
      </div>

      {/* Template Form Modal */}
      {isFormOpen && (
        <TemplateForm
          template={editingTemplate}
          onClose={() => {
            setIsFormOpen(false)
            setEditingTemplate(null)
          }}
          onSuccess={handleFormSuccess}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-[#242525] border-[#2a2b2b]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Template</AlertDialogTitle>
            <AlertDialogDescription className="text-[#9ca3af]">
              Are you sure you want to delete "{deletingTemplate?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-[#2a2b2b] text-white border-[#2a2b2b] hover:bg-[#3a3b3b]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-[#ff4444] text-white hover:bg-[#dd3333]"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}