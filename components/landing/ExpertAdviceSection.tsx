/* eslint-disable react/no-unescaped-entities */
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

export function ExpertAdviceSection() {
  return (
    <section className="py-20 md:py-32 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-linear(ellipse_80%_50%_at_50%_-20%,rgba(80,163,248,0.05),rgba(0,0,0,0))]" />
        <div className="absolute inset-0 bg-[radial-linear(ellipse_60%_50%_at_50%_60%,rgba(47,171,184,0.03),rgba(0,0,0,0))]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal text-white mb-4 tracking-tight">
            Way beyond a resume builder...
          </h2>
        </div>

        {/* Features Grid */}
        <div className="space-y-6 lg:space-y-8">
          {/* Row 1: 60% + 40% - Step by Step + AI Writes */}
          <div className="grid md:grid-cols-5 gap-6 lg:gap-8">
            {/* Card 1: Step-by-step guidance - 60% width */}
            <Link href="#" className="group relative block overflow-hidden md:col-span-3">
              {/* Card */}
              <div className="relative rounded-3xl bg-[#f3f2ff] p-10 min-h-[420px] overflow-visible flex flex-col">

                {/* LEFT CONTENT */}
                <div className="relative z-10 flex flex-col flex-1 max-w-lg">
                  
                  {/* Badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-600 text-xs font-bold mb-6 self-start">
                    <Sparkles className="w-4 h-4" />
                    AI-powered
                  </div>

                  {/* Title with max-width */}
                  <h3 className="text-3xl font-normal text-gray-900 mb-4 max-w-md">
                    Step-by-step guidance
                  </h3>

                  {/* Paragraph with max-width */}
                  <p className="text-[14px] text-gray-700 font-normal max-w-[350px] mb-6">
                    No need to think much. We guide you through every step of the process.
                    We show you what to add, and where to add it. It's clear and simple.
                  </p>

                  {/* Button fixed to the very bottom of the card */}
                  <div className="mt-auto pt-8">
                    <span className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors text-base font-medium group/cta">
                      Create my resume
                      <ArrowRight className="w-4 h-4 group-hover/cta:translate-x-1 transition-transform" />
                    </span>
                  </div>

                </div>

                {/* RIGHT FLOATING IMAGE */}
                <div
                  aria-hidden
                  className="absolute right-0 bottom-0 top-0 w-[60%] pointer-events-none flex items-end justify-end"
                >
                  <div className="relative h-full w-full translate-x-[18%]">
                    <Image
                      src="/card-11.png"
                      alt="Steps visual"
                      fill
                      priority
                      sizes="(min-width: 1024px) 50vw, 80vw"
                      className="object-contain object-right-bottom"
                    />
                  </div>
                </div>

                {/* Hover arrow */}
                <div className="absolute top-8 right-8 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                  <ArrowRight className="w-5 h-5 text-blue-500" />
                </div>

              </div>
            </Link>


            {/* Card 2: AI writes for you - 40% width */}
            <Link href="#" className="group relative block overflow-hidden md:col-span-2">
            {/* Card */}
            <div className="relative rounded-3xl bg-[#f5f0ff] p-10 min-h-[420px] overflow-visible flex flex-col">

              {/* CONTENT */}
              <div className="relative z-10 flex flex-col flex-1 max-w-lg">
                
                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-600 text-xs font-bold mb-6 self-start">
                  <Sparkles className="w-4 h-4" />
                  AI-powered
                </div>

                {/* Title with max-width */}
                <h3 className="text-3xl font-normal text-gray-900 mb-4 max-w-md">
                  AI writes for you
                </h3>

                {/* Paragraph with max-width */}
                <p className="text-[14px] text-gray-700 font-normal max-w-[330px] mb-6">
                  Speak into the mic and the AI fixes mistakes. Stuck? Click to add phrases that sound professional.
                </p>

              </div>

              {/* BOTTOM IMAGE (smaller) */}
              <div
                aria-hidden
                className="absolute left-0 right-0 bottom-0 h-[35%] pointer-events-none"
              >
                <div className="relative h-full w-full translate-x-[19%]">
                  <Image
                    src="/card-2.png"
                    alt="AI writes for you"
                    fill
                    priority
                    sizes="(min-width: 768px) 40vw, 80vw"
                    className="object-contain object-bottom"
                  />
                </div>
              </div>

              {/* Hover arrow */}
              <div className="absolute top-8 right-8 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                <ArrowRight className="w-5 h-5 text-blue-500" />
              </div>

            </div>
          </Link>
          </div>

          {/* Row 2: 40% + 60% - Instant Cover Letters + Paste Job Link */}
          <div className="grid md:grid-cols-5 gap-6 lg:gap-8">
            {/* Card 3: Instant cover letters - 40% width */}
            <Link href="#" className="group relative block overflow-hidden md:col-span-2">
            {/* Card */}
            <div className="relative rounded-3xl bg-[#f5f0ff] p-10 min-h-[420px] overflow-visible flex flex-col">

              {/* CONTENT */}
              <div className="relative z-10 flex flex-col flex-1 max-w-lg">
                
                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-600 text-xs font-bold mb-6 self-start">
                  <Sparkles className="w-4 h-4" />
                  AI-powered
                </div>

                {/* Title with max-width */}
                <h3 className="text-3xl font-normal text-gray-900 mb-4 max-w-md">
                  Instant cover letters
                </h3>

                {/* Paragraph with max-width */}
                <p className="text-[14px] text-gray-700 font-normal max-w-[330px] mb-6">
                  Just paste a job link. We create a matching cover letter. using your resume. You're done in 2 mins! Purpose built to impress recruiters.
                </p>

              </div>

              {/* BOTTOM IMAGE (smaller) */}
              <div
                aria-hidden
                className="absolute left-0 right-0 bottom-0 h-[50%] pointer-events-none"
              >
                <div className="relative h-full w-full">
                  <Image
                    src="/card-3.png"
                    alt="AI writes for you"
                    fill
                    priority
                    sizes="(min-width: 768px) 40vw, 80vw"
                    className="object-contain object-bottom"
                  />
                </div>
              </div>

              {/* Hover arrow */}
              <div className="absolute top-8 right-8 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                <ArrowRight className="w-5 h-5 text-blue-500" />
              </div>

            </div>
          </Link>


            {/* Card 4: Paste any job link - 60% width */}
            <Link href="#" className="group relative block overflow-hidden md:col-span-3">
  {/* Card */}
  <div className="relative rounded-3xl bg-[#e8f4f8] p-10 min-h-[420px] overflow-visible flex flex-col">

    {/* LEFT CONTENT */}
    <div className="relative z-10 flex flex-col flex-1 max-w-lg">
      
      {/* Badge (optional - add if you want) */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-600 text-xs font-bold mb-6 self-start">
        <Sparkles className="w-4 h-4" />
        Smart matching
      </div>

      {/* Title with max-width */}
      <h3 className="text-3xl font-normal text-gray-900 mb-4 max-w-md">
        Paste any job link
      </h3>

      {/* Paragraph with max-width */}
      <p className="text-[14px] text-gray-700 font-normal max-w-[320px] mb-6">
        Simple and effective. We have the formula that works for recruiters. Just paste the job description and we pre-build your resume to match.
      </p>

      {/* Button fixed to the very bottom of the card */}
      <div className="mt-auto pt-8">
        <span className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors text-base font-medium group/cta">
          Tailor my resume
          <ArrowRight className="w-4 h-4 group-hover/cta:translate-x-1 transition-transform" />
        </span>
      </div>

    </div>

    {/* RIGHT FLOATING IMAGE */}
    <div
      aria-hidden
      className="absolute right-0 bottom-0 top-0 w-[50%] pointer-events-none flex items-end justify-end"
    >
      <div className="relative h-full w-full">
        <Image
          src="/card-4.png"
          alt="Paste any job link"
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 80vw"
          className="object-contain object-right-bottom"
        />
      </div>
    </div>

    {/* Hover arrow */}
    <div className="absolute top-8 right-8 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
      <ArrowRight className="w-5 h-5 text-blue-500" />
    </div>

  </div>
</Link>
          </div>

          {/* Row 3: 40% + 60% - Recruiter Match + Need Some Advice */}
          <div className="grid md:grid-cols-5 gap-6 lg:gap-8">
            {/* Card 5: Recruiter Match - 40% width */}
            <Link href="#" className="group relative block overflow-hidden md:col-span-3">
  {/* Card */}
  <div className="relative rounded-3xl bg-[#e8f4fb] p-10 min-h-[420px] overflow-visible flex flex-col">

    {/* LEFT CONTENT */}
    <div className="relative z-10 flex flex-col flex-1 max-w-lg">
      
      {/* Badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-600 text-xs font-bold mb-6 self-start">
        <Sparkles className="w-4 h-4" />
        Exclusive
      </div>

      {/* Title with max-width */}
      <h3 className="text-3xl font-normal text-gray-900 mb-4 max-w-md">
        Recruiter Match
      </h3>

      {/* Paragraph with max-width */}
      <p className="text-[14px] text-gray-700 font-normal max-w-[350px] mb-6">
        Recruiters come to us with roles they can't fill. We can match your resume with up to 50 recruiters a week. When there's a match, they will contact you via email.
      </p>

      {/* Button fixed to the very bottom of the card */}
      <div className="mt-auto pt-8">
        <span className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors text-base font-medium group/cta">
          Start distributing
          <ArrowRight className="w-4 h-4 group-hover/cta:translate-x-1 transition-transform" />
        </span>
      </div>

    </div>

    {/* RIGHT FLOATING IMAGE */}
    <div
      aria-hidden
      className="absolute right-0 bottom-10 top-0 w-[50%] pointer-events-none flex items-end justify-end"
    >
      <div className="relative h-full w-full ">
        <Image
          src="/card-5.png"
          alt="Recruiter Match"
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 80vw"
          className="object-contain object-right-bottom"
        />
      </div>
    </div>

    {/* Hover arrow */}
    <div className="absolute top-8 right-8 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
      <ArrowRight className="w-5 h-5 text-blue-500" />
    </div>

  </div>
</Link>

            {/* Card 6: Need some advice - 60% width */}
            <Link href="#" className="group relative block overflow-hidden md:col-span-2">
            {/* Card */}
            <div className="relative rounded-3xl bg-linear-to-br from-[#e8f8f0] to-[#f0faf5] backdrop-blur-sm p-10 min-h-[420px] overflow-visible flex flex-col">

              {/* CONTENT */}
              <div className="relative z-10 flex flex-col flex-1 max-w-lg">
                
                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-600 text-xs font-bold mb-6 self-start">
                  <Sparkles className="w-4 h-4" />
                  AI-powered
                </div>

                {/* Title with max-width */}
                <h3 className="text-3xl font-normal text-gray-900 mb-4 max-w-md">
                  Need some advice?
                </h3>

                {/* Paragraph with max-width */}
                <p className="text-[14px] text-gray-700 font-normal max-w-[330px] mb-6">
                  98% of our coaching clients receive a job offer with 12 weeks.
                </p>

              </div>

              {/* BOTTOM IMAGE (smaller) */}
              <div
                aria-hidden
                className="absolute left-0 right-0 bottom-0 h-[45%] pointer-events-none"
              >
                <div className="relative h-full w-full">
                  <Image
                    src="/card-6.png"
                    alt="Need some advice?"
                    fill
                    priority
                    sizes="(min-width: 768px) 40vw, 80vw"
                    className="object-contain object-bottom"
                  />
                </div>
              </div>

              {/* Hover arrow */}
              <div className="absolute top-8 right-8 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                <ArrowRight className="w-5 h-5 text-blue-500" />
              </div>

            </div>
          </Link>
          </div>
        </div>
      </div>
    </section>
  )
}