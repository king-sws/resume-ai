// components/landing/HeroSection.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Check, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

const TYPING_WORDS = [
  'an interview',
  'hired faster',
  'noticed',
  'your dream job'
]

export function HeroSection() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [typingSpeed, setTypingSpeed] = useState(150)

  useEffect(() => {
    const word = TYPING_WORDS[currentWordIndex]

    const timer = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (currentText.length < word.length) {
          setCurrentText(word.substring(0, currentText.length + 1))
          setTypingSpeed(100)
        } else {
          // Pause before deleting
          setTypingSpeed(2000)
          setIsDeleting(true)
        }
      } else {
        // Deleting
        if (currentText.length > 0) {
          setCurrentText(word.substring(0, currentText.length - 1))
          setTypingSpeed(50)
        } else {
          // Move to next word
          setIsDeleting(false)
          setCurrentWordIndex((prev) => (prev + 1) % TYPING_WORDS.length)
          setTypingSpeed(500)
        }
      }
    }, typingSpeed)

    return () => clearTimeout(timer)
  }, [currentText, isDeleting, currentWordIndex, typingSpeed])

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden bg-[#0a0a0a] pt-20 pb-16 md:pt-24 md:pb-20">
      {/* Subtle Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-linear(ellipse_80%_50%_at_50%_-20%,rgba(80,163,248,0.08),rgba(0,0,0,0))]" />
        <div className="absolute inset-0 bg-[radial-linear(ellipse_60%_50%_at_50%_40%,rgba(47,171,184,0.05),rgba(0,0,0,0))]" />
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Heading with Typewriter */}
            <div className="space-y-4">
              <h1 className="text-[2.75rem] sm:text-5xl md:text-6xl lg:text-[4rem] xl:text-[4.5rem] max-w-[500px] font-normal text-white leading-[1.1] tracking-tight">
  This resume builder gets you{' '}
  <span className="relative inline-block min-w-[200px]">
    <span className="bg-linear-to-r from-purple-400 via-blue-400 to-teal-400 bg-clip-text text-transparent">
      {currentText}
      <span className="animate-blink">|</span>
    </span>
  </span>
</h1>
              
              <p className="mt-2 text-pretty text-[19px] text-neutral-500">
                Only 2% of resumes win. Yours will be one of them.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth/sign-up" className="inline-block">
  <Button
    size="lg"
    className="
      flex h-14 px-8 w-full sm:w-auto items-center justify-center gap-2
      text-[19px] font-semibold rounded-md transition-all

      bg-linear-to-r from-purple-400 via-blue-400 to-teal-400 text-white border border-black
      hover:bg-neutral-900 hover:border-neutral-900

      dark:bg-white dark:text-black  dark:border-white
      dark:hover:bg-neutral-100 dark:hover:border-neutral-100
      dark:hover:ring-neutral-300/40
    "
  >
    Create my resume
  </Button>
</Link>

<Link href="/upload" className="inline-block">
  <Button
    size="lg"
    variant="outline"
    className="
      flex h-14 px-8 w-full sm:w-auto items-center justify-center gap-2
      text-[19px] font-semibold rounded-md transition-all

      bg-transparent text-white border border-white
      hover:bg-white hover:text-black hover:transition-all

      dark:bg-transparent dark:text-black dark:border-black
      dark:hover:bg-black dark:hover:text-white
    "
  >
    Upload my resume
  </Button>
</Link>



            </div>

            {/* Trust Indicators */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500/10 border border-green-500/20">
                  <Check className="w-4 h-4 text-green-500" />
                </div>
                <p className="text-white/70 text-base">
                  <span className="font-semibold text-white">39%</span> more likely to land the job
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-green-500 fill-green-500" />
                  <span className="text-white font-semibold">Trustpilot</span>
                </div>
                <span className="text-white/60">4.4 out of 5 | 17,531 reviews</span>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
<div className="relative lg:pl-8">
  <div className="relative rounded-2xl overflow-hidden shadow-2xl">
    <Image
      src="/hero-img.png"
      alt="ResumeAI Platform Interface"
      width={1200}
      height={800}
      className="w-full h-auto rounded-2xl"
      priority
    />
  </div>
</div>

        </div>
      </div>

    </section>
  )
}