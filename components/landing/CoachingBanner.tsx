'use client'

import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface CoachingBannerProps {
  className?: string
}

export function CoachingBanner({ className = '' }: CoachingBannerProps) {
  return (
    // Main container with proper padding matching your HeroSection
    <section className={`w-full px-6 sm:px- lg:px-12 py-8 ${className}`}>
      {/* Inner container with background and rounded corners */}
      <div className="max-w-7xl mx-auto bg-gradient-to-br from-blue-50 to-blue-100/80 rounded-2xl p-4 shadow-lg border border-blue-100">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          {/* Left side - Profile images and text */}
          <div className="flex flex-col sm:flex-row items-center ">
            {/* Profile images - properly sized */}
            <div className="relative flex-shrink-0">
              <div className="relative">
                <Image
                  src="/users.png"
                  alt="Career Coaches"
                  width={220}
                  height={220}
                  className="w-full h-full object-contain rounded-full"
                  priority
                />
              </div>
            </div>

            {/* Text content */}
            <div className="flex flex-col gap-2 text-center sm:text-left max-w-md">
              <h2 className="text-3xl md:text-4xl font-normal text-gray-900 tracking-tight">
                Need some advice?
              </h2>
              <p className="text-[15px] font-medium text-gray-700 ">
                98% of our coaching clients receive a job offer within 12 weeks.
              </p>
            </div>
          </div>

          {/* Right side - Button */}
          <div className="flex-shrink-0 w-full sm:w-auto">
            <Button 
              size="lg"
              className="
                flex h-14 px-8 w-full sm:w-auto items-center justify-center
                text-lg font-semibold rounded-lg transition-all
                bg-linear-to-r from-purple-400 via-blue-400 to-teal-400
                hover:shadow-xl hover:scale-105
                shadow-md
              "
            >
                <Link href="/dashboard">
                    Find your coach
                </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}