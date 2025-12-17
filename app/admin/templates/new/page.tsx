// app/admin/templates/new/page.tsx
import { TemplateFormPage } from '@/components/admin/TemplateFormPage'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function NewTemplatePage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/auth/sign-in')
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Add New Template</h1>
        <p className="text-gray-400">Create a new resume template</p>
      </div>

      {/* Form */}
      <TemplateFormPage />
    </div>
  )
}