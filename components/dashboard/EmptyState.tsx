// components/dashboard/EmptyState.tsx
import Link from 'next/link'
import { FileText, Plus, Sparkles, Target, Zap, Shield, Palette } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function EmptyState() {
  const features = [
    {
      icon: Zap,
      title: 'AI-Powered Writing',
      description: 'Get intelligent suggestions and instant improvements',
      color: '#50a3f8'
    },
    {
      icon: Shield,
      title: 'ATS-Optimized',
      description: 'Pass applicant tracking systems automatically',
      color: '#2fabb8'
    },
    {
      icon: Palette,
      title: 'Professional Templates',
      description: 'Choose from modern, expertly designed layouts',
      color: '#50a3f8'
    },
    {
      icon: Target,
      title: 'Job Matching',
      description: 'Tailor your resume to specific positions',
      color: '#2fabb8'
    }
  ]

  return (
    <div 
      className="rounded-xl border-2 border-dashed p-12 text-center"
      style={{ 
        backgroundColor: '#242525',
        borderColor: '#2a2b2b'
      }}
    >
      {/* Icon */}
      <div className="flex justify-center mb-6">
        <div 
          className="w-20 h-20 rounded-2xl flex items-center justify-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #50a3f8, #2fabb8)'
          }}
        >
          <FileText className="w-10 h-10 text-white relative z-10" />
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), transparent 50%)'
            }}
          />
        </div>
      </div>
      
      {/* Heading */}
      <h3 className="text-2xl font-bold mb-3" style={{ color: '#ffffff' }}>
        Create Your First Resume
      </h3>
      
      <p className="text-base mb-8 max-w-2xl mx-auto" style={{ color: '#7e7e7e' }}>
        Build a professional, ATS-friendly resume in minutes with AI assistance. 
        Choose from premium templates and let our technology help you stand out.
      </p>
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
        <Link href="/dashboard/resumes/new" className="w-full sm:w-auto">
          <Button 
            size="lg" 
            className="w-full sm:w-auto transition-all duration-200 hover:scale-105 shadow-lg"
            style={{ 
              backgroundColor: '#50a3f8',
              color: '#ffffff',
              paddingLeft: '2rem',
              paddingRight: '2rem'
            }}
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Resume Now
          </Button>
        </Link>
        
        <Link href="/dashboard/templates" className="w-full sm:w-auto">
          <Button 
            size="lg" 
            variant="outline"
            className="w-full sm:w-auto transition-all duration-200 hover:scale-105"
            style={{ 
              backgroundColor: 'transparent',
              color: '#7e7e7e',
              borderColor: '#2a2b2b',
              paddingLeft: '2rem',
              paddingRight: '2rem'
            }}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Browse Templates
          </Button>
        </Link>
      </div>
      
      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <div 
              key={index}
              className="p-6 rounded-xl transition-all duration-200 hover:scale-105"
              style={{ 
                backgroundColor: '#2a2b2b',
                borderWidth: '1px',
                borderColor: 'transparent',
                borderStyle: 'solid'
              }}
            >
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4"
                style={{
                  backgroundColor: feature.color + '20'
                }}
              >
                <Icon className="w-6 h-6" style={{ color: feature.color }} />
              </div>
              <h4 className="text-sm font-semibold mb-2" style={{ color: '#ffffff' }}>
                {feature.title}
              </h4>
              <p className="text-xs leading-relaxed" style={{ color: '#7e7e7e' }}>
                {feature.description}
              </p>
            </div>
          )
        })}
      </div>

      {/* Additional Info */}
      <div 
        className="mt-8 p-4 rounded-lg inline-flex items-center space-x-2"
        style={{ 
          backgroundColor: '#50a3f820',
          borderColor: '#50a3f840',
          borderWidth: '1px'
        }}
      >
        <Sparkles className="w-4 h-4" style={{ color: '#50a3f8' }} />
        <span className="text-sm" style={{ color: '#7e7e7e' }}>
          Join <span className="font-semibold" style={{ color: '#ffffff' }}>10,000+</span> professionals who landed their dream job
        </span>
      </div>
    </div>
  )
}