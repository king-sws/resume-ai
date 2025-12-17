// app/admin/templates/[id]/edit/page.tsx
import { auth } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import prisma from '@/lib/db'
import { TemplateFormPage } from '@/components/admin/TemplateFormPage'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditTemplatePage({ params }: PageProps) {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect('/auth/sign-in')
  }

  const { id } = await params

  // Check if template exists
  const template = await prisma.template.findUnique({
    where: { id },
  })

  if (!template) {
    notFound()
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Edit Template</h1>
        <p className="text-gray-400">Update template information</p>
      </div>

      {/* Form */}
      <TemplateFormPage templateId={id} />
    </div>
  )
}