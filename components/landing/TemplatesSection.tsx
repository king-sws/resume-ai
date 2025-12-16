/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Users, Star } from 'lucide-react'

interface Template {
  id: string
  name: string
  image: string
  users: string
  category: string
}

const templates: Template[] = [
  { id: '1', name: 'Shokumukeirekisho', image: '/templates/balance.png', users: '5,200', category: 'Japanese Style' },
  { id: '2', name: 'Academic', image: '/templates/acadimic.png', users: '8,400', category: 'Research' },
  { id: '3', name: 'Entry Level', image: '/templates/entry.jpg', users: '12,100', category: 'Beginner' },
  { id: '4', name: 'Classic', image: '/templates/simple.png', users: '7,600,000', category: 'Most Popular' },
  { id: '5', name: 'Traditional', image: '/templates/clear.png', users: '3,200', category: 'Conservative' },
  { id: '6', name: 'Professional', image: '/templates/clean.png', users: '9,800', category: 'Corporate' },
  { id: '7', name: 'Prime ATS', image: '/templates/prim.png', users: '15,300', category: 'ATS-Optimized' }
]

export function TemplatesSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [visibleTemplates, setVisibleTemplates] = useState(4)

  // Update visible templates based on screen size
  useEffect(() => {
    const updateVisibleTemplates = () => {
      if (window.innerWidth < 640) {
        setVisibleTemplates(1) // Mobile: 1 template
      } else if (window.innerWidth < 1024) {
        setVisibleTemplates(2) // Tablet: 2 templates
      } else if (window.innerWidth < 1280) {
        setVisibleTemplates(3) // Small desktop: 3 templates
      } else {
        setVisibleTemplates(4) // Large desktop: 4 templates
      }
    }

    updateVisibleTemplates()
    window.addEventListener('resize', updateVisibleTemplates)
    return () => window.removeEventListener('resize', updateVisibleTemplates)
  }, [])
  
  // Create infinite loop by duplicating templates
  const extendedTemplates = [...templates, ...templates, ...templates]
  const startOffset = templates.length

  useEffect(() => {
    // Start at the middle set of templates
    setCurrentIndex(startOffset)
  }, [])

  const handlePrevious = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex(prev => prev - 1)
  }

  const handleNext = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex(prev => prev + 1)
  }

  const handleTransitionEnd = () => {
    setIsTransitioning(false)
    
    // Reset to middle set when reaching boundaries
    if (currentIndex >= startOffset + templates.length) {
      setCurrentIndex(startOffset)
    } else if (currentIndex < startOffset) {
      setCurrentIndex(startOffset + templates.length - 1)
    }
  }

  // Calculate which dot should be active (based on actual position in original array)
  const activeDotIndex = ((currentIndex - startOffset) % templates.length + templates.length) % templates.length

  return (
    <section id="templates" className="relative w-full bg-[#0a0a0a] py-12 sm:py-16 md:py-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-linear(ellipse_80%_50%_at_50%_-20%,rgba(80,163,248,0.06),rgba(0,0,0,0))]" />
        <div className="absolute inset-0 bg-[radial-linear(ellipse_60%_50%_at_50%_40%,rgba(47,171,184,0.04),rgba(0,0,0,0))]" />
      </div>

      <div className="w-full">
        {/* Header - with padding */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16 space-y-3 sm:space-y-4 px-4 sm:px-6 lg:px-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-white tracking-tight">
            Tested resume templates
          </h2>
          <p className="text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto px-4">
            Use the templates recruiters like. Download to Word or PDF.
          </p>
        </div>

        {/* Slider Container */}
        <div className="relative w-full px-4 sm:px-8 md:px-12">
          {/* Navigation Buttons */}
          <button
            onClick={handlePrevious}
            disabled={isTransitioning}
            className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-cyan-600/60 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all hover:bg-cyan-600/40 hover:scale-110 disabled:opacity-40"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>

          <button
            onClick={handleNext}
            disabled={isTransitioning}
            className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-cyan-600/60 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all hover:bg-cyan-600/40 hover:scale-110 disabled:opacity-40"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>

          {/* Templates Slider */}
          <div className="overflow-visible">
            <div 
              className={`flex gap-3 sm:gap-4 md:gap-6 ${isTransitioning ? 'transition-transform duration-500 ease-out' : ''}`}
              style={{ transform: `translateX(-${currentIndex * (100 / visibleTemplates)}%)` }}
              onTransitionEnd={handleTransitionEnd}
            >
              {extendedTemplates.map((template, index) => (
                <div
                  key={`${template.id}-${index}`}
                  className="shrink-0 group cursor-pointer"
                  style={{ width: `calc(${100 / visibleTemplates}% - ${(visibleTemplates - 1) * (visibleTemplates === 1 ? 12 : visibleTemplates === 2 ? 16 : 24) / visibleTemplates}px)` }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="relative">
                    {/* Template Image Container */}
                    <div className={`relative rounded-lg overflow-hidden transition-all duration-300 ${
                      hoveredIndex === index ? 'shadow-2xl shadow-blue-500/30 scale-105' : 'shadow-lg'
                    }`}>
                      {/* Template Image */}
                      <div className="relative aspect-[8.5/11] overflow-hidden bg-white">
                        <Image
                          src={template.image}
                          alt={template.name}
                          fill
                          className="object-contain"
                        />
                        
                        {/* Overlay on hover */}
                        <div className={`absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 z-10 ${
                          hoveredIndex === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}>
                          {/* Template Info Overlay */}
                          <div className="absolute inset-0 flex flex-col justify-between p-3 sm:p-4 md:p-6">
                            {/* Top Info */}
                            <div className={`flex items-start justify-between transition-all duration-300 ${
                              hoveredIndex === index ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
                            }`}>
                              <div>
                                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-1 sm:mb-2">{template.name}</h3>
                                <span className="inline-block px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-400/30 backdrop-blur-sm">
                                  {template.category}
                                </span>
                              </div>
                              {template.name === 'Classic' && (
                                <div className="flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full bg-green-500/20 border border-green-400/30 backdrop-blur-sm">
                                  <Star className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-green-400 fill-green-400" />
                                  <span className="text-xs text-green-300 font-medium hidden sm:inline">Popular</span>
                                </div>
                              )}
                            </div>

                            {/* Bottom Info and Button */}
                            <div className={`space-y-2 sm:space-y-3 md:space-y-4 transition-all duration-300 ${
                              hoveredIndex === index ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                            }`}>
                              <div className="flex items-center gap-2 text-xs sm:text-sm text-white/80">
                                <Users className="w-3 sm:w-4 h-3 sm:h-4" />
                                <span>{template.users}+ users</span>
                              </div>
                              <button className="w-full bg-linear-to-r from-purple-400 via-blue-400 to-teal-400 text-white border-0 hover:shadow-xl hover:shadow-blue-500/50 transition-all font-semibold py-2 sm:py-2.5 rounded-md text-xs sm:text-sm">
                                Use this template
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Dots - Optional, currently commented out in original */}
          <div className="flex justify-center gap-2 mt-6 sm:mt-8 md:mt-10">
            {templates.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!isTransitioning) {
                    setIsTransitioning(true)
                    setCurrentIndex(startOffset + index)
                  }
                }}
                className={`h-1.5 sm:h-2 rounded-full transition-all ${
                  activeDotIndex === index ? 'w-6 sm:w-8 bg-linear-to-r from-purple-400 to-blue-400' : 'w-1.5 sm:w-2 bg-neutral-600 hover:bg-neutral-500'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}