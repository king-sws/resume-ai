// components/landing/PricingSection.tsx
'use client'

import { Check, Crown, Sparkles } from 'lucide-react'
import Link from 'next/link'

export function PricingSection() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started',
      features: [
        '1 Resume',
        '10 AI Credits/month',
        'Basic Templates',
        'Basic Analytics',
        'Application Tracking',
      ],
      cta: 'Get Started',
      href: '/auth/sign-up',
      popular: false,
    },
    {
      name: 'Pro',
      price: '$9.99',
      period: '/month',
      description: 'For serious job seekers',
      features: [
        'Unlimited Resumes',
        '100 AI Credits/month',
        'All Premium Templates',
        'Advanced Analytics',
        'Priority Support',
        'Resume Version History',
        'ATS Optimization',
        'Export in All Formats',
      ],
      cta: 'Start Pro Trial',
      href: '/auth/sign-up',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: '$29.99',
      period: '/month',
      description: 'For teams and agencies',
      features: [
        'Everything in Pro',
        '500 AI Credits/month',
        'Team Collaboration',
        'Custom Branding',
        'API Access',
        'Dedicated Support',
        '24/7 Priority Help',
        'Custom Integrations',
      ],
      cta: 'Contact Sales',
      href: '/auth/sign-up',
      popular: false,
    },
  ]

  return (
    <section id="pricing" className="py-10  relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 mb-6">
            <Crown className="w-4 h-4 text-[#50a3f8]" />
            <span className="text-sm font-normal text-white">Pricing</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-normal text-white mb-6">
            Simple,{' '}
            <span className="bg-linear-to-r from-[#50a3f8] to-[#2fabb8] bg-clip-text text-transparent">
              Transparent Pricing
            </span>
          </h2>
          
          <p className="text-[14px] text-gray-400 max-w-3xl mx-auto">
            Choose the plan that fits your needs. Start free and upgrade anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl backdrop-blur-sm transition-all ${
                plan.popular
                  ? 'border-[2px] rounded-3xl animated-border shadow-2xl shadow-[#50a3f8]/20 bg-white/10 backdrop-blur-xl transition-transform duration-300 '
                  : 'border border-white/10 hover:border-white/20 bg-white/5'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="px-4 py-1.5 rounded-lg bg-linear-to-r from-[#50a3f8] to-[#2fabb8] text-white text-sm font-semibold shadow-lg flex items-center gap-1">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="p-8">
                {/* Plan Name */}
                <h3 className="text-2xl font-bold text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-400 text-sm mb-6">
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-normal text-white">
                      {plan.price}
                    </span>
                    <span className="text-gray-400 text-[15px]">
                      {plan.period}
                    </span>
                  </div>
                </div>

                {/* CTA Button */}
                <Link href={plan.href} className="block mb-8">
                  <button
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                      plan.popular
                        ? 'bg-linear-to-r from-[#50a3f8] to-[#2fabb8] text-white hover:opacity-90 shadow-lg'
                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </Link>

                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#10b981] shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}