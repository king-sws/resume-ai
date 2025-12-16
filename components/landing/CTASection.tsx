'use client'

import Image from 'next/image'
import Link from 'next/link'

export function CTASection() {
  return (
    <section className="py-12 md:py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-[#e8f4fd]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-[#d4e9fa] to-[#e8f4fd] border border-blue-100 overflow-hidden shadow-xl">
          <div className="grid md:grid-cols-2 gap-8 items-center p-8 md:p-12 lg:p-16">
            {/* Left Content */}
            <div className="space-y-6">
              <div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal text-gray-900 mb-4">
                  Join over{' '}
                  <span className="font-semibold text-[#2196f3]">
                    12,474
                  </span>
                  <br />
                  resume makers
                </h2>
                <p className="text-lg md:text-xl text-gray-700">
                  Start now and get hired faster.
                </p>
              </div>

              <Link href="/dashboard/resume/new">
                <button className="px-8 py-3.5 rounded-lg bg-[#2196f3] text-white font-semibold text-base hover:bg-[#1976d2] transition-colors shadow-md hover:shadow-lg">
                  Create my resume
                </button>
              </Link>
            </div>

            {/* Right Image Section */}
            <div className="relative flex justify-center items-center">
              <div className="relative w-full max-w-md">
                {/* Main Image */}
                <div className="relative rounded-2xl overflow-hidden ">
                  <Image
                    src="/footer-card.png"
                    alt="Professional resume maker"
                    width={400}
                    height={300}
                    className="w-full h-auto"
                  />
                </div>

                
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}