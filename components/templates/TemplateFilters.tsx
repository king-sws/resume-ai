// components/templates/TemplateFilters.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'
import { Layout, Palette, Sparkles, Minimize2, Briefcase, Code, X } from 'lucide-react'

interface CategoryCount {
  category: string
  _count: number
}

interface TemplateFiltersProps {
  currentCategory?: string
  categoryCounts: CategoryCount[]
}

export function TemplateFilters({ currentCategory, categoryCounts }: TemplateFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const categories = [
    { 
      label: 'All Templates', 
      value: 'ALL', 
      icon: Layout,
      color: '#50a3f8',
      bgColor: '#50a3f810',
      borderColor: '#50a3f830'
    },
    { 
      label: 'Modern', 
      value: 'MODERN', 
      icon: Sparkles,
      color: '#50a3f8',
      bgColor: '#50a3f810',
      borderColor: '#50a3f830'
    },
    { 
      label: 'Classic', 
      value: 'CLASSIC', 
      icon: Briefcase,
      color: '#6b7280',
      bgColor: '#6b728010',
      borderColor: '#6b728030'
    },
    { 
      label: 'Creative', 
      value: 'CREATIVE', 
      icon: Palette,
      color: '#f59e0b',
      bgColor: '#f59e0b10',
      borderColor: '#f59e0b30'
    },
    { 
      label: 'Minimalist', 
      value: 'MINIMALIST', 
      icon: Minimize2,
      color: '#2fabb8',
      bgColor: '#2fabb810',
      borderColor: '#2fabb830'
    },
    { 
      label: 'Professional', 
      value: 'PROFESSIONAL', 
      icon: Briefcase,
      color: '#50a3f8',
      bgColor: '#50a3f810',
      borderColor: '#50a3f830'
    },
    { 
      label: 'Technical', 
      value: 'TECHNICAL', 
      icon: Code,
      color: '#6366f1',
      bgColor: '#6366f110',
      borderColor: '#6366f130'
    },
  ]

  const getCategoryCount = (category: string) => {
    if (category === 'ALL') {
      return categoryCounts.reduce((sum, c) => sum + c._count, 0)
    }
    const found = categoryCounts.find(c => c.category === category)
    return found?._count || 0
  }

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (category === 'ALL') {
      params.delete('category')
    } else {
      params.set('category', category)
    }
    
    startTransition(() => {
      router.push(`/dashboard/templates?${params.toString()}`)
    })
  }

  const activeCategory = currentCategory || 'ALL'

  return (
    <div className="space-y-6">
      {/* Category Filters */}
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => {
          const Icon = category.icon
          const isActive = category.value === activeCategory
          const count = getCategoryCount(category.value)
          
          return (
            <button
              key={category.value}
              onClick={() => handleCategoryChange(category.value)}
              disabled={isPending}
              className="relative group transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div 
                className={`
                  flex items-center gap-3 px-4 py-2 rounded-xl border transition-all duration-200
                  ${isActive ? 'shadow-lg' : 'hover:shadow-md'}
                `}
                style={{
                  backgroundColor: isActive ? category.bgColor : '#242525',
                  borderColor: isActive ? category.color : '#2a2b2b',
                  borderWidth: isActive ? '2px' : '1px'
                }}
              >
                {/* Icon */}
                <div 
                  className="p-2 rounded-lg transition-all duration-200"
                  style={{
                    backgroundColor: isActive ? `${category.color}20` : '#2a2b2b'
                  }}
                >
                  <Icon 
                    className="w-4 h-4" 
                    style={{ color: isActive ? category.color : '#9ca3af' }}
                  />
                </div>

                {/* Label and Count */}
                <div className="flex items-center gap-3">
                  <span 
                    className="font-medium text-sm whitespace-nowrap"
                    style={{ color: isActive ? '#ffffff' : '#9ca3af' }}
                  >
                    {category.label}
                  </span>
                  
                  <div 
                    className="px-2.5 py-1 rounded-full text-xs font-bold min-w-[32px] text-center"
                    style={{
                      backgroundColor: isActive ? category.color : '#2a2b2b',
                      color: isActive ? '#ffffff' : '#9ca3af'
                    }}
                  >
                    {count}
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Active Filter Display */}
      {currentCategory && currentCategory !== 'ALL' && (
        <div className="flex flex-wrap gap-2 items-center p-4 bg-[#242525] border border-[#2a2b2b] rounded-xl">
          <span className="text-sm font-medium text-[#9ca3af]">Active filters:</span>
          <span 
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border"
            style={{
              backgroundColor: categories.find(c => c.value === currentCategory)?.bgColor || '#50a3f810',
              color: categories.find(c => c.value === currentCategory)?.color || '#50a3f8',
              borderColor: categories.find(c => c.value === currentCategory)?.borderColor || '#50a3f830'
            }}
          >
            <span>Category: {categories.find(c => c.value === currentCategory)?.label}</span>
            <button
              onClick={() => handleCategoryChange('ALL')}
              className="hover:opacity-70 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        </div>
      )}
    </div>
  )
}