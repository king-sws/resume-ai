'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Menu, X, Sparkles, ChevronDown, FileText, Briefcase, Zap, Trophy, BookOpen, GraduationCap, Building2, ShoppingBag, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface NavItem {
  name: string
  href: string
  dropdown?: {
    featured?: FeaturedCard
    sections: DropdownSection[]
  }
}

interface FeaturedCard {
  title: string
  description: string
  icon: React.ReactNode
  href: string
  cta: string
  bglinear: string
}

interface DropdownSection {
  title?: string
  items: DropdownItem[]
}

interface DropdownItem {
  icon: React.ElementType
  iconColor: string
  iconBg: string
  title: string
  description: string
  href: string
}

const NAVIGATION: NavItem[] = [
  {
    name: 'Resume Templates',
    href: '#templates',
    dropdown: {
      featured: {
        title: 'Resume Builder',
        description: 'Build powerful resumes in only 5 minutes with our easy to use Resume Builder and get hired faster.',
        icon: (
          <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-1">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
              <Image
                src="/image/resume.svg"
                alt="Resume Builder"
                width={48}
                height={48}
              />
            </div>
          </div>
        ),
        href: '/builder',
        cta: 'Get started now',
        bglinear: 'from-blue-600/20 via-purple-600/20 to-pink-600/20',
      },
      sections: [
        {
          items: [
            {
              icon: Trophy,
              iconColor: 'text-blue-400',
              iconBg: 'bg-blue-500/10',
              title: 'ATS',
              description: 'Optimise your resume and impress employers with these ATS-friendly designs.',
              href: '/templates/ats',
            },
            {
              icon: FileText,
              iconColor: 'text-blue-400',
              iconBg: 'bg-blue-500/10',
              title: 'Google docs',
              description: 'Google Docs templates for fast, flexible editing—easy to update, share, and customize anywhere.',
              href: '/templates/google-docs',
            },
            {
              icon: Zap,
              iconColor: 'text-blue-400',
              iconBg: 'bg-blue-500/10',
              title: 'Modern',
              description: 'A current and stylish feel for forward-thinking candidates in innovative fields',
              href: '/templates/modern',
            },
          ],
        },
        {
          items: [
            {
              icon: Briefcase,
              iconColor: 'text-blue-400',
              iconBg: 'bg-blue-500/10',
              title: 'Professional',
              description: 'Job-winning templates to showcase professionalism, dependability, and expertise',
              href: '/templates/professional',
            },
            {
              icon: Sparkles,
              iconColor: 'text-blue-400',
              iconBg: 'bg-blue-500/10',
              title: 'Simple',
              description: 'Clean, timeless templates with a classic balanced structure. A perfect basic canvas',
              href: '/templates/simple',
            },
            {
              icon: FileText,
              iconColor: 'text-blue-400',
              iconBg: 'bg-blue-500/10',
              title: 'Word',
              description: 'Microsoft Word templates, perfect for downloading, editing, and customizing offline.',
              href: '/templates/word',
            },
          ],
        },
      ],
    },
  },
  {
    name: 'Resume Examples',
    href: '#examples',
    dropdown: {
      featured: {
        title: '500+ Free Resume Examples',
        description: 'Use the expert guides and our resume builder to create a beautiful resume in minutes.',
        icon: (
          <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-1">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
        ),
        href: '/examples',
        cta: 'View all examples',
        bglinear: 'from-purple-600/20 via-indigo-600/20 to-blue-600/20',
      },
      sections: [
        {
          title: 'Most Popular',
          items: [
            {
              icon: GraduationCap,
              iconColor: 'text-purple-400',
              iconBg: 'bg-purple-500/10',
              title: 'Education',
              description: 'Educate employers on your skills with a resume fit for any role',
              href: '/examples/education',
            },
            {
              icon: Building2,
              iconColor: 'text-purple-400',
              iconBg: 'bg-purple-500/10',
              title: 'Government',
              description: 'Create a government resume that commands attention',
              href: '/examples/government',
            },
            {
              icon: Zap,
              iconColor: 'text-purple-400',
              iconBg: 'bg-purple-500/10',
              title: 'Engineering',
              description: 'Build the foundation for success with tailored engineering resumes',
              href: '/examples/engineering',
            },
          ],
        },
        {
          items: [
            {
              icon: ShoppingBag,
              iconColor: 'text-purple-400',
              iconBg: 'bg-purple-500/10',
              title: 'Retail',
              description: 'Showcase your retail experience professionally',
              href: '/examples/retail',
            },
            {
              icon: Trophy,
              iconColor: 'text-purple-400',
              iconBg: 'bg-purple-500/10',
              title: 'Healthcare',
              description: 'Medical and healthcare resume examples',
              href: '/examples/healthcare',
            },
            {
              icon: Briefcase,
              iconColor: 'text-purple-400',
              iconBg: 'bg-purple-500/10',
              title: 'Business',
              description: 'Professional business resume templates',
              href: '/examples/business',
            },
          ],
        },
      ],
    },
  },
  {
    name: 'Cover Letter',
    href: '#cover-letter',
    dropdown: {
      featured: {
        title: 'Cover Letter Builder',
        description: 'Build professional cover letters in a few simple steps by using our free Cover Letter builder.',
        icon: (
          <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-1">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
        ),
        href: '/cover-letter/builder',
        cta: 'Create cover letter',
        bglinear: 'from-orange-600/20 via-red-600/20 to-pink-600/20',
      },
      sections: [
        {
          title: 'Templates',
          items: [
            {
              icon: FileText,
              iconColor: 'text-orange-400',
              iconBg: 'bg-orange-500/10',
              title: 'Google docs',
              description: 'Quick, flexible editing templates you can share anytime',
              href: '/cover-letter/google-docs',
            },
            {
              icon: FileText,
              iconColor: 'text-orange-400',
              iconBg: 'bg-orange-500/10',
              title: 'Microsoft word',
              description: 'Offline templates you can customize in Word',
              href: '/cover-letter/word',
            },
            {
              icon: Briefcase,
              iconColor: 'text-orange-400',
              iconBg: 'bg-orange-500/10',
              title: 'Professional',
              description: 'Polished designs for formal applications',
              href: '/cover-letter/professional',
            },
          ],
        },
        {
          title: 'Examples',
          items: [
            {
              icon: Sparkles,
              iconColor: 'text-orange-400',
              iconBg: 'bg-orange-500/10',
              title: 'Simple',
              description: 'Clean, straightforward letter templates',
              href: '/cover-letter/simple',
            },
            {
              icon: Trophy,
              iconColor: 'text-orange-400',
              iconBg: 'bg-orange-500/10',
              title: 'By Industry',
              description: 'Industry-specific cover letter examples',
              href: '/cover-letter/industry',
            },
            {
              icon: GraduationCap,
              iconColor: 'text-orange-400',
              iconBg: 'bg-orange-500/10',
              title: 'Entry Level',
              description: 'Perfect for first-time job seekers',
              href: '/cover-letter/entry-level',
            },
          ],
        },
      ],
    },
  },
  { name: 'FAQ', href: '#faq' },
  {
    name: 'Resources',
    href: '#resources',
    dropdown: {
      featured: {
        title: 'Career Resources',
        description: 'Get ahead with our latest career advice, tips, and insights to accelerate your professional journey.',
        icon: (
          <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-1">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
          </div>
        ),
        href: '/blog',
        cta: 'Explore resources',
        bglinear: 'from-green-600/20 via-emerald-600/20 to-teal-600/20',
      },
      sections: [
        {
          title: 'Popular Topics',
          items: [
            {
              icon: Trophy,
              iconColor: 'text-green-400',
              iconBg: 'bg-green-500/10',
              title: 'Job Interview',
              description: 'Ace your interviews with expert strategies',
              href: '/resources/interview',
            },
            {
              icon: Briefcase,
              iconColor: 'text-green-400',
              iconBg: 'bg-green-500/10',
              title: 'Career Growth',
              description: 'Navigate your career path with confidence',
              href: '/resources/career',
            },
            {
              icon: BookOpen,
              iconColor: 'text-green-400',
              iconBg: 'bg-green-500/10',
              title: 'Resume Tips',
              description: 'Expert advice for building perfect resumes',
              href: '/resources/resume-tips',
            },
          ],
        },
        {
          items: [
            {
              icon: Zap,
              iconColor: 'text-green-400',
              iconBg: 'bg-green-500/10',
              title: 'Quick Guides',
              description: 'Fast, actionable career advice',
              href: '/resources/guides',
            },
            {
              icon: FileText,
              iconColor: 'text-green-400',
              iconBg: 'bg-green-500/10',
              title: 'Blog Articles',
              description: 'In-depth career insights and trends',
              href: '/resources/blog',
            },
            {
              icon: GraduationCap,
              iconColor: 'text-green-400',
              iconBg: 'bg-green-500/10',
              title: 'Video Tutorials',
              description: 'Step-by-step visual guides',
              href: '/resources/videos',
            },
          ],
        },
      ],
    },
  },
]

export default function LandingHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false)
        setActiveDropdown(null)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [isMobileMenuOpen])

  // Clear any pending timeout when component unmounts
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
      }
    }
  }, [])

  const handleMouseEnter = (itemName: string) => {
    // Clear any pending close timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    setActiveDropdown(itemName)
  }

  const handleMouseLeave = () => {
    // Add a small delay before closing to allow smooth transition
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null)
    }, 150)
  }

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
      setIsMobileMenuOpen(false)
      setActiveDropdown(null)
    }
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          isScrolled
            ? 'bg-black/90 backdrop-blur-xl border-b border-white/10'
            : 'bg-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center gap-2 group relative z-50"
            >
              <Image src="/logo-w.png" alt="Logo" width={100} height={90} />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {NAVIGATION.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => item.dropdown && handleMouseEnter(item.name)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    href={item.href}
                    onClick={(e) => handleSmoothScroll(e, item.href)}
                    className={`flex items-center gap-1 px-4 py-2 text-[15px] font-medium transition-colors rounded-lg ${
                      activeDropdown === item.name
                        ? 'text-[#0d99ff] bg-white/10'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.name}
                    {item.dropdown && (
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === item.name ? 'rotate-180' : ''}`} />
                    )}
                  </Link>
                </div>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3 relative z-50">
              <Link href="/auth/sign-in">
                <Button variant="ghost" size="sm" className="text-[#50a3f8] hover:text-[#50a3f8] hover:bg-white/5">
                  Sign in
                </Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button 
                  size="default"
                  className="bg-[#0d99ff] hover:bg-[#0d99ff]/90 text-white px-6 shadow-md hover:shadow-lg transition-all"
                >
                  Create my resume
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-300 hover:text-white rounded-md hover:bg-white/5 transition-colors relative z-50"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>

        {/* Desktop Full Width Dropdown */}
        {NAVIGATION.map((item) => 
          item.dropdown && activeDropdown === item.name ? (
            <div 
              key={item.name}
              className="hidden lg:block absolute left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 shadow-2xl"
              style={{ top: isScrolled ? '64px' : '80px' }}
              onMouseEnter={() => handleMouseEnter(item.name)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-12 gap-8">
                  {/* Featured Card - Left Side */}
                  {item.dropdown.featured && (
                    <div className="col-span-4">
                      <Link
                        href={item.dropdown.featured.href}
                        className={`block h-full bg-gradient-to-br ${item.dropdown.featured.bglinear} backdrop-blur-sm rounded-2xl p-8 hover:scale-[1.02] transition-all duration-300 border border-white/10 group`}
                      >
                        <div className="mb-6">
                          {/* {item.dropdown.featured.icon} */}
                        </div>
                        <h3 className="text-2xl font-normal text-white mb-4 leading-tight">
                          {item.dropdown.featured.title}
                        </h3>
                        <p className="text-sm text-neutral-500 mb-6 leading-relaxed">
                          {item.dropdown.featured.description}
                        </p>
                        <div className="flex items-center gap-2 text-white font-semibold text-sm group-hover:gap-3 transition-all">
                          {item.dropdown.featured.cta}
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </Link>
                    </div>
                  )}

                  {/* Grid Items - Right Side */}
                  <div className="col-span-8">
                    <div className="grid grid-cols-2 gap-8">
                      {item.dropdown.sections.map((section, sectionIdx) => (
                        <div key={sectionIdx}>
                          {section.title && (
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">
                              {section.title}
                            </h4>
                          )}
                          <div className="space-y-1">
                            {section.items.map((dropItem) => {
                              const Icon = dropItem.icon
                              return (
                                <Link
                                  key={dropItem.title}
                                  href={dropItem.href}
                                  className="flex items-start gap-4 px-4 py-4 hover:bg-white/5 rounded-xl transition-all duration-200 group border border-transparent hover:border-white/10"
                                >
                                  <div className="shrink-0 mt-0.5">
                                    <div className={`w-11 h-11 rounded-xl ${dropItem.iconBg} flex items-center justify-center backdrop-blur-sm border border-white/5 group-hover:scale-110 transition-transform`}>
                                      <Icon className={`w-5 h-5 ${dropItem.iconColor}`} />
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h5 className="text-sm font-bold text-white group-hover:text-[#50a3f8] transition-colors">
                                        {dropItem.title}
                                      </h5>
                                      <ArrowRight className="w-3.5 h-3.5 text-gray-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                    </div>
                                    <p className="text-xs text-gray-400 leading-relaxed">
                                      {dropItem.description}
                                    </p>
                                  </div>
                                </Link>
                              )
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null
        )}
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed top-16 sm:top-20 left-0 right-0 bottom-0 bg-black/95 backdrop-blur-xl border-t border-white/10 z-40 lg:hidden overflow-y-auto">
            <div className="p-4 space-y-1">
              {NAVIGATION.map((item) => (
                <div key={item.name}>
                  {item.dropdown ? (
                    <div className="border-b border-white/5 pb-1 mb-1">
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === item.name ? null : item.name)}
                        className="w-full flex items-center justify-between px-3 py-2.5 text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <span>{item.name}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === item.name ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {/* Mobile Dropdown Content */}
                      {activeDropdown === item.name && (
                        <div className="mt-1 space-y-2 animate-in slide-in-from-top-2 duration-200">
                          {/* Featured Card for Mobile */}
                          {item.dropdown.featured && (
                            <Link
                              href={item.dropdown.featured.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={`block bg-gradient-to-br ${item.dropdown.featured.bglinear} backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all`}
                            >
                              <div className="flex items-start gap-3">
                                <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center shrink-0">
                                  <div className="w-8 h-8 bg-gradient-to-br from-white/20 to-white/5 rounded-lg flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-white" />
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-white font-bold mb-1 text-sm">{item.dropdown.featured.title}</h4>
                                  <p className="text-gray-300 text-xs mb-2 leading-relaxed line-clamp-2">{item.dropdown.featured.description}</p>
                                  <span className="text-white text-xs font-semibold inline-flex items-center gap-1.5">
                                    {item.dropdown.featured.cta} <ArrowRight className="w-3 h-3" />
                                  </span>
                                </div>
                              </div>
                            </Link>
                          )}
                          
                          {/* Dropdown Items for Mobile */}
                          <div className="space-y-1">
                            {item.dropdown.sections.map((section, sectionIdx) => (
                              <div key={sectionIdx}>
                                {section.title && (
                                  <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 py-2 mt-2">
                                    {section.title}
                                  </h5>
                                )}
                                {section.items.map((dropItem) => {
                                  const Icon = dropItem.icon
                                  return (
                                    <Link
                                      key={dropItem.title}
                                      href={dropItem.href}
                                      onClick={() => setIsMobileMenuOpen(false)}
                                      className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
                                    >
                                      <div className="mt-0.5 shrink-0">
                                        <div className={`w-9 h-9 rounded-lg ${dropItem.iconBg} flex items-center justify-center border border-white/5`}>
                                          <Icon className={`w-4 h-4 ${dropItem.iconColor}`} />
                                        </div>
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="text-sm font-semibold text-white mb-0.5">{dropItem.title}</div>
                                        <div className="text-xs text-gray-400 leading-relaxed line-clamp-2">{dropItem.description}</div>
                                      </div>
                                    </Link>
                                  )
                                })}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={(e) => handleSmoothScroll(e, item.href)}
                      className="block px-3 py-2.5 text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
              
              {/* Mobile CTA Buttons */}
              <div className="pt-4 space-y-2 border-t border-white/10 mt-4">
                <Link href="/auth/sign-in" className="block">
                  <Button variant="outline" className="w-full border-white/10 text-gray-300 hover:text-white hover:bg-white/5">
                    Sign in
                  </Button>
                </Link>
                <Link href="/auth/sign-up" className="block">
                  <Button className="w-full bg-[#0d99ff] hover:bg-[#0d99ff]/90 text-white">
                    Create my resume
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}