// components/landing/HowItWorksSection.tsx
'use client'

import React from 'react';
import { Check } from 'lucide-react';
import Image from 'next/image';

export const ResumeOptimizationSection: React.FC = () => {
  const features = [
    "Showcase your most relevant experiences",
    "Align keywords with industry demands",
    "Refine format for clarity and appeal",
    "Strengthen each section with targeted improvements"
  ];

  return (
    <section id="examples" className="w-full py-16 md:py-24 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Side - Resume Preview Image */}
          <div className="relative order-2 lg:order-1">
            {/* Glow Effect Behind Image */}
            <div className="absolute inset-0 bg-linear-to-r from-purple-500/20 via-blue-500/20 to-teal-500/20 blur-3xl rounded-3xl -z-10" />
            
            {/* Resume Image */}
            <div className="relative">
              <Image 
                src="/resume.webp" 
                alt="Resume optimization preview" 
                width={800}
                height={1000}
                className="w-full h-auto rounded-lg shadow-2xl"
                priority
              />
              
              {/* Floating AI-Powered Card */}
              <div className="hidden lg:block absolute -top-10 -right-12 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-xl border border-gray-200 max-w-[200px]">
  {/* Header Badge */}
  <div className="flex items-center gap-1 mb-2">
    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <div className="bg-indigo-100 text-indigo-600 font-semibold text-[9px] px-2 py-0.5 rounded-md">
      AI Resume
    </div>
  </div>

  {/* Title */}
  <h3 className="text-sm font-bold text-gray-800 mb-1">
    Highlights
  </h3>

  {/* Description */}
  <p className="text-gray-600 text-[10px] mb-2 leading-snug">
    Achievements, awards, stand-out results — share your past successes!
  </p>

  {/* Progress Bar */}
  <div className="mb-1">
    <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
      <div className="h-full w-[60%] bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-500" />
    </div>
  </div>

  {/* Completion Text */}
  <p className="text-gray-800 font-bold mt-2 text-[10px]">
    88% Completed
  </p>
</div>


              {/* Floating Score Card */}
              <div className="absolute top-35 -left-4 lg:-left-6 bg-white/95 backdrop-blur-md p-4 sm:p-6 rounded-xl shadow-2xl border border-gray-200 max-w-xs sm:max-w-sm">
  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-teal-500 rounded-lg flex items-center justify-center">
      <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    </div>
    <h3 className="text-sm sm:text-lg font-bold text-gray-700">AI ASSISTANT</h3>
  </div>
  
  <h4 className="text-xs sm:text-base font-bold text-gray-600 mb-3 sm:mb-4">BOOST YOUR SCORE</h4>
  
  <div className="space-y-2 sm:space-y-3">
    <div className="flex items-center gap-2 sm:gap-3">
      <span className="bg-teal-100 text-teal-700 font-bold text-xs sm:text-sm px-2 py-0.5 sm:px-3 sm:py-1 rounded-lg whitespace-nowrap">
        +2%
      </span>
      <span className="text-gray-700 text-xs sm:text-sm">Add job title</span>
    </div>
    
    <div className="flex items-center gap-2 sm:gap-3">
      <span className="bg-teal-100 text-teal-700 font-bold text-xs sm:text-sm px-2 py-0.5 sm:px-3 sm:py-1 rounded-lg whitespace-nowrap">
        +15%
      </span>
      <span className="text-gray-700 text-xs sm:text-sm">Add employment history</span>
    </div>
  </div>
</div>

            </div>
          </div>

          {/* Right Side - Content */}
          <div className="space-y-8 order-1 lg:order-2">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal text-white leading-tight">
                Optimize Your Resume&rsquo;s{' '}
                <span className="bg-linear-to-r from-purple-400 via-blue-400 to-teal-400 bg-clip-text text-transparent">
                  Potential
                </span>
              </h2>
              
              <p className="text-[16px] md:text-[17px] text-neutral-500 leading-relaxed">
                Leverage smart insights and personalized guidance to stand out from the crowd. 
                Elevate every section of your resume, ensuring it resonates with hiring managers 
                and unlocks the next step in your career.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-4 pt-4">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-4 group"
                >
                  <div className="shrink-0 w-6 h-6 rounded-full bg-teal-500/20 flex items-center justify-center mt-1 group-hover:bg-teal-500/30 transition-colors duration-300">
                    <Check className="w-4 h-4 text-teal-400" strokeWidth={3} />
                  </div>
                  <p className="text-gray-300 text-base md:text-lg group-hover:text-white transition-colors duration-300">
                    {feature}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="pt-6">
              <button className="group relative px-8 py-4 bg-linear-to-r from-purple-600 via-blue-600 to-teal-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-[1.02] overflow-hidden">
                <span className="relative z-10">Get Started Now</span>
                <div className="absolute inset-0 bg-linear-to-r from-purple-700 via-blue-700 to-teal-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};