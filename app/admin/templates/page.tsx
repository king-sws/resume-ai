// app/admin/templates/page.tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import prisma from '@/lib/db'
import { AdminTemplateCard } from '@/components/admin/AdminTemplateCard'

export default async function AdminTemplatesPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/auth/sign-in')
  }

  const templates = await prisma.template.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Templates</h1>
          <p className="text-gray-400">Manage resume templates</p>
        </div>
        
        <Link href="/admin/templates/new">
          <Button className="bg-linear-to-r from-[#50a3f8] to-[#2fabb8] hover:opacity-90 text-white">
            <Plus className="w-5 h-5 mr-2" />
            Add Template
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <p className="text-sm text-gray-400 mb-1">Total Templates</p>
          <p className="text-3xl font-bold text-white">{templates.length}</p>
        </div>
        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <p className="text-sm text-gray-400 mb-1">Active</p>
          <p className="text-3xl font-bold text-[#10b981]">
            {templates.filter(t => t.isActive).length}
          </p>
        </div>
        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <p className="text-sm text-gray-400 mb-1">Premium</p>
          <p className="text-3xl font-bold text-[#50a3f8]">
            {templates.filter(t => t.isPremium).length}
          </p>
        </div>
        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <p className="text-sm text-gray-400 mb-1">Total Usage</p>
          <p className="text-3xl font-bold text-white">
            {templates.reduce((sum, t) => sum + t.usageCount, 0)}
          </p>
        </div>
      </div>

      {/* Templates Grid */}
      {templates.length === 0 ? (
        <div className="text-center py-20 rounded-xl bg-white/5 border border-white/10">
          <div className="inline-flex p-4 rounded-full bg-white/5 mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No templates yet
          </h3>
          <p className="text-gray-400 mb-6">
            Create your first template to get started
          </p>
          <Link href="/admin/templates/new">
            <Button className="bg-linear-to-r from-[#50a3f8] to-[#2fabb8] hover:opacity-90 text-white">
              <Plus className="w-5 h-5 mr-2" />
              Add Template
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {templates.map((template) => (
            <AdminTemplateCard key={template.id} template={template} />
          ))}
        </div>
      )}
    </div>
  )
}