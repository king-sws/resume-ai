// app/dashboard/templates/page.tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Crown, Sparkles, Filter, Layout, Zap, Award } from 'lucide-react'
import prisma from '@/lib/db'
import { TemplateCard } from '@/components/templates/TemplateCard'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { TemplateFilters } from '@/components/templates/TemplateFilters'

interface PageProps {
  searchParams: Promise<{
    category?: string
  }>
}

export default async function TemplatesPage({ searchParams }: PageProps) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/auth/sign-in')
  }

  // Await searchParams
  const params = await searchParams
  const category = params.category

  // Fetch user to check plan
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true },
  })

  // Build where clause
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { isActive: true }
  if (category && category !== 'ALL') {
    where.category = category
  }

  // Fetch all templates
  const templates = await prisma.template.findMany({
    where,
    orderBy: [
      { isPremium: 'asc' }, // Free templates first
      { usageCount: 'desc' },
    ],
  })

  const freeTemplates = templates.filter(t => !t.isPremium)
  const premiumTemplates = templates.filter(t => t.isPremium)
  const isPro = user?.plan === 'PRO' || user?.plan === 'ENTERPRISE'

  // Get category counts
  const categoryCounts = await prisma.template.groupBy({
    by: ['category'],
    where: { isActive: true },
    _count: true
  })

  return (
    <div className="min-h-screen bg-[#191a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Resume Templates
            </h1>
            <p className="mt-2 text-[#9ca3af]">
              Choose from our collection of professional, ATS-friendly resume templates
            </p>
          </div>
          
          <Link href="/dashboard/resumes/new">
            <Button 
              size="lg"
              className="bg-[#50a3f8] hover:bg-[#3d8dd9] text-white transition-all hover:scale-[1.02] shadow-lg hover:shadow-xl font-semibold"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Create Resume
            </Button>
          </Link>
        </div>

        {/* Enhanced Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative p-6 rounded-xl border border-[#2a2b2b] bg-[#242525] transition-all duration-200 hover:scale-[1.02] cursor-pointer group overflow-hidden">
            <div className="absolute inset-0 bg-[#50a3f8] opacity-0 group-hover:opacity-5 transition-opacity duration-200" />
            <div className="relative flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium mb-2 text-[#9ca3af]">
                  Total Templates
                </p>
                <p className="text-3xl font-bold tracking-tight text-white">
                  {templates.length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#2a2b2b]">
                <Layout className="w-5 h-5 text-[#50a3f8]" />
              </div>
            </div>
          </div>

          <div className="relative p-6 rounded-xl border border-[#2a2b2b] bg-[#242525] transition-all duration-200 hover:scale-[1.02] cursor-pointer group overflow-hidden">
            <div className="absolute inset-0 bg-[#2fabb8] opacity-0 group-hover:opacity-5 transition-opacity duration-200" />
            <div className="relative flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium mb-2 text-[#9ca3af]">
                  Free Templates
                </p>
                <p className="text-3xl font-bold tracking-tight text-[#2fabb8]">
                  {freeTemplates.length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#2a2b2b]">
                <Zap className="w-5 h-5 text-[#2fabb8]" />
              </div>
            </div>
          </div>

          <div className="relative p-6 rounded-xl border border-[#2a2b2b] bg-[#242525] transition-all duration-200 hover:scale-[1.02] cursor-pointer group overflow-hidden">
            <div className="absolute inset-0 bg-[#50a3f8] opacity-0 group-hover:opacity-5 transition-opacity duration-200" />
            <div className="relative flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium mb-2 text-[#9ca3af]">
                  Premium
                </p>
                <p className="text-3xl font-bold tracking-tight text-[#50a3f8]">
                  {premiumTemplates.length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#2a2b2b]">
                <Crown className="w-5 h-5 text-[#50a3f8]" />
              </div>
            </div>
          </div>

          <div className="relative p-6 rounded-xl border border-[#2a2b2b] bg-[#242525] transition-all duration-200 hover:scale-[1.02] cursor-pointer group overflow-hidden">
            <div className="absolute inset-0 bg-[#f59e0b] opacity-0 group-hover:opacity-5 transition-opacity duration-200" />
            <div className="relative flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium mb-2 text-[#9ca3af]">
                  Your Plan
                </p>
                <div className="flex items-center gap-2">
                  {isPro ? (
                    <>
                      <Crown className="w-5 h-5 text-[#50a3f8]" />
                      <p className="text-2xl font-bold tracking-tight text-[#50a3f8]">
                        Pro
                      </p>
                    </>
                  ) : (
                    <p className="text-2xl font-bold tracking-tight text-[#9ca3af]">
                      Free
                    </p>
                  )}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-[#2a2b2b]">
                <Award className="w-5 h-5 text-[#f59e0b]" />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Pro Banner */}
        {!isPro && premiumTemplates.length > 0 && (
  <div className="group relative rounded-xl border border-cyan-500/40 bg-[#1c1c1c] p-6 overflow-hidden transition-transform duration-200 hover:scale-[1.01]">
    
    {/* Subtle hover glow */}
    <div className="absolute inset-0 bg-linear-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />

    <div className="relative flex items-start gap-4">
      
      {/* Icon Box */}
      <div className="w-14 h-14 rounded-xl bg-linear-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg">
        <Crown className="w-7 h-7 text-white" />
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-white">
          Unlock {premiumTemplates.length} Premium Templates
        </h3>

        <p className="mt-2 mb-4 text-gray-400 leading-relaxed text-sm">
          Upgrade to Pro to access exclusive templates with unique designs and
          advanced features that help your work stand out.
        </p>

        <Link href="/dashboard/upgrade">
          <Button className="bg-cyan-500 hover:bg-cyan-600 text-white font-medium shadow-md hover:shadow-lg transition-all">
            <Crown className="w-4 h-4 mr-2" />
            Upgrade to Pro
          </Button>
        </Link>
      </div>
    </div>
  </div>
)}


        {/* Filters */}
        <TemplateFilters 
          currentCategory={category}
          categoryCounts={categoryCounts}
        />

        {/* Free Templates */}
        {freeTemplates.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-bold text-white">
                Free Templates
              </h2>
              <span className="px-3 py-1.5 text-xs font-bold rounded-full bg-[#2fabb820] text-[#2fabb8] border border-[#2fabb830]">
                {freeTemplates.length} Available
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {freeTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  canUse={true}
                  isPro={isPro}
                />
              ))}
            </div>
          </div>
        )}

        {/* Premium Templates */}
        {premiumTemplates.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-bold text-white">
                Premium Templates
              </h2>
              <span className="px-3 py-1.5 text-xs font-bold rounded-full bg-[#50a3f820] text-[#50a3f8] border border-[#50a3f830] flex items-center gap-1.5">
                <Crown className="w-3 h-3" />
                <span>{premiumTemplates.length} Pro</span>
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {premiumTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  canUse={isPro}
                  isPro={isPro}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {templates.length === 0 && (
          <div className="rounded-xl border bg-[#242525] border-[#2a2b2b] p-12 text-center">
            <div className="inline-flex p-4 rounded-full mb-4 bg-[#2a2b2b]">
              <Filter className="w-8 h-8 text-[#9ca3af]" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">
              No templates found
            </h3>
            <p className="mb-6 max-w-md mx-auto text-[#9ca3af]">
              Try changing your filters or browse all templates.
            </p>
            <Link href="/dashboard/templates">
              <Button 
                variant="outline"
                className="border-[#2a2b2b] text-[#9ca3af] bg-transparent hover:bg-[#2a2b2b] hover:text-white transition-all duration-200"
              >
                Clear Filters
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}