/* eslint-disable react-hooks/exhaustive-deps */
// components/landing/StatsSection.tsx
'use client'

import { useEffect, useRef, useState } from 'react'

export function StatsSection() {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const targetValue = 12474
  const duration = 2000

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const increment = targetValue / (duration / 16)
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= targetValue) {
        setCount(targetValue)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [isVisible, targetValue, duration])

  return (
    <section className="relative py-8 md:py-16 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div ref={ref} className="flex items-center justify-center gap-4">
          {/* Counter Icon */}
<div className="w-40 h-20 relative">
  <svg
    viewBox="0 0 200 100"
    className="w-full h-full"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Background Arc */}
    <path
      d="M 20 80 A 80 80 0 0 1 180 80"
      stroke="#50a3f8"
      strokeWidth="8"
      strokeOpacity="0.15"
      strokeLinecap="round"
    />

    {/* Active Arc */}
    <path
      d="M 20 80 A 80 80 0 0 1 150 50"
      stroke="url(#gradient)"
      strokeWidth="8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Needle */}
    <line
      x1="100"
      y1="80"
      x2="145"
      y2="35"
      stroke="#50a3f8"
      strokeWidth="4"
      strokeLinecap="round"
    />

    {/* Needle Center Circle */}
    <circle
      cx="100"
      cy="80"
      r="6"
      fill="#50a3f8"
      stroke="white"
      strokeWidth="2"
    />

    {/* Gradient Definition */}
    <defs>
      <linearGradient id="gradient" x1="20" y1="80" x2="150" y2="50" gradientUnits="userSpaceOnUse">
        <stop stopColor="#50a3f8" />
        <stop offset="1" stopColor="#3b82f6" />
      </linearGradient>
    </defs>
  </svg>
</div>



          {/* Counter Text */}
          <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-1 sm:gap-2">
            <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-linear-to-r from-[#50a3f8] to-[#2fabb8] bg-clip-text text-transparent">
              {count.toLocaleString()}
            </span>
            <span className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-normal text-white/80 text-center sm:text-left">
              resumes created today
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}