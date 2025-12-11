/* eslint-disable @typescript-eslint/no-explicit-any */
// components/pricing/PricingClient.tsx
'use client'

import { useState } from 'react'
import { 
  Check, 
  Crown, 
  FileText, 
  Brain,
  Users,
  Shield,
  Sparkles,
  TrendingUp,
  Loader2,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface UsageStats {
  resumesCreated: number
  resumesLimit: number
  aiCreditsUsed: number
  aiCreditsLimit: number
}

interface PricingClientProps {
  currentPlan: string
  subscriptionStatus: string | null
  currentPeriodEnd: Date | null
  usageStats: UsageStats
}

export function PricingClient({
  currentPlan,
  subscriptionStatus,
  currentPeriodEnd,
  usageStats,
}: PricingClientProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [loading, setLoading] = useState<string | null>(null)

  const handleUpgrade = async (plan: 'PRO' | 'ENTERPRISE') => {
    setLoading(plan)

    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan,
          billingCycle,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout')
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to start upgrade')
      setLoading(null)
    }
  }

  const handleManageSubscription = async () => {
    setLoading('manage')

    try {
      const response = await fetch('/api/stripe/create-portal', {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to open portal')
      }

      window.location.href = data.url
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to open portal')
      setLoading(null)
    }
  }

  const plans = [
    {
      id: 'FREE',
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      description: 'Perfect for getting started',
      icon: FileText,
      color: 'from-[#6b7280] to-[#4b5563]',
      features: [
        { text: '1 Resume', included: true },
        { text: '10 AI Credits/month', included: true },
        { text: 'Basic Templates', included: true },
        { text: 'Basic Analytics', included: true },
        { text: 'Job Application Tracking', included: true },
        { text: 'Premium Templates', included: false },
        { text: 'Priority Support', included: false },
        { text: 'Advanced AI Features', included: false },
      ],
      cta: 'Current Plan',
      popular: false,
    },
    {
      id: 'PRO',
      name: 'Pro',
      price: { monthly: 9.99, yearly: 99 },
      description: 'For serious job seekers',
      icon: Crown,
      color: 'from-[#50a3f8] to-[#2fabb8]',
      features: [
        { text: 'Unlimited Resumes', included: true },
        { text: '100 AI Credits/month', included: true },
        { text: 'All Premium Templates', included: true },
        { text: 'Advanced Analytics', included: true },
        { text: 'Unlimited Applications', included: true },
        { text: 'AI Resume Analysis', included: true },
        { text: 'Priority Email Support', included: true },
        { text: 'Resume Version History', included: true },
      ],
      cta: 'Upgrade to Pro',
      popular: true,
    },
    {
      id: 'ENTERPRISE',
      name: 'Enterprise',
      price: { monthly: 29.99, yearly: 299 },
      description: 'For teams and agencies',
      icon: Users,
      color: 'from-[#8b5cf6] to-[#6366f1]',
      features: [
        { text: 'Everything in Pro', included: true },
        { text: '500 AI Credits/month', included: true },
        { text: 'Team Collaboration', included: true },
        { text: 'Custom Branding', included: true },
        { text: 'API Access', included: true },
        { text: 'Dedicated Account Manager', included: true },
        { text: '24/7 Priority Support', included: true },
        { text: 'Custom Integrations', included: true },
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ]

  const savingsPercentage = 17 // ~2 months free

  return (
    <div className="min-h-screen bg-[#191a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-[#50a3f8]/10 to-[#2fabb8]/10 border border-[#50a3f8]/20 mb-4">
            <Sparkles className="w-4 h-4 text-[#50a3f8]" />
            <span className="text-sm font-semibold text-[#50a3f8]">
              Special Offer: 2 Months Free on Annual Plans
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Choose Your Plan
          </h1>
          <p className="text-xl text-[#9ca3af] max-w-2xl mx-auto">
            Unlock powerful features to accelerate your job search and land your dream job faster
          </p>
        </div>

        {/* Current Plan Status */}
        {currentPlan !== 'FREE' && (
          <div className="max-w-2xl mx-auto p-6 rounded-xl border border-[#2a2b2b] bg-[#242525]">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-linear-to-br from-[#50a3f8] to-[#2fabb8]">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Current Plan: {currentPlan}
                  </h3>
                  <p className="text-sm text-[#9ca3af]">
                    {subscriptionStatus === 'active' ? (
                      <>
                        Active • Renews on{' '}
                        {currentPeriodEnd && new Date(currentPeriodEnd).toLocaleDateString()}
                      </>
                    ) : (
                      `Status: ${subscriptionStatus || 'Unknown'}`
                    )}
                  </p>
                  <div className="mt-3 flex gap-4 text-sm">
                    <div>
                      <span className="text-[#9ca3af]">Resumes: </span>
                      <span className="text-white font-semibold">
                        {usageStats.resumesCreated} / {usageStats.resumesLimit === -1 ? '∞' : usageStats.resumesLimit}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#9ca3af]">AI Credits: </span>
                      <span className="text-white font-semibold">
                        {usageStats.aiCreditsUsed} / {usageStats.aiCreditsLimit}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <Button
                onClick={handleManageSubscription}
                disabled={loading === 'manage'}
                variant="outline"
                size="sm"
                className="border-[#2a2b2b] text-[#9ca3af] hover:bg-[#2a2b2b]"
              >
                {loading === 'manage' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Manage'
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Billing Cycle Toggle */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-3 p-1 rounded-xl bg-[#242525] border border-[#2a2b2b]">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-linear-to-r from-[#50a3f8] to-[#2fabb8] text-white shadow-lg'
                  : 'text-[#9ca3af] hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all relative ${
                billingCycle === 'yearly'
                  ? 'bg-linear-to-r from-[#50a3f8] to-[#2fabb8] text-white shadow-lg'
                  : 'text-[#9ca3af] hover:text-white'
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 px-2 py-0.5 text-xs font-bold rounded-full bg-[#10b981] text-white">
                Save {savingsPercentage}%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => {
            const Icon = plan.icon
            const isCurrentPlan = currentPlan === plan.id
            const price = billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly
            const isYearly = billingCycle === 'yearly'

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl border-2 transition-all duration-200 ${
                  plan.popular
                    ? 'border-[#50a3f8] shadow-xl shadow-[#50a3f8]/20 scale-105'
                    : 'border-[#2a2b2b] hover:border-[#3a3b3b]'
                } ${
                  isCurrentPlan ? 'bg-[#242525]' : 'bg-[#1a1b1b]'
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="px-4 py-1.5 rounded-full bg-linear-to-r from-[#50a3f8] to-[#2fabb8] text-white text-sm font-bold shadow-lg">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="p-8 space-y-6">
                  {/* Header */}
                  <div>
                    <div className={`inline-flex p-3 rounded-xl bg-linear-to-br ${plan.color} mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-[#9ca3af] text-sm">
                      {plan.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold text-white">
                        ${price}
                      </span>
                      <span className="text-[#9ca3af]">
                        /{isYearly ? 'year' : 'month'}
                      </span>
                    </div>
                    {isYearly && price > 0 && (
                      <p className="text-sm text-[#10b981] mt-2">
                        ${(price / 12).toFixed(2)}/month billed annually
                      </p>
                    )}
                  </div>

                  {/* CTA Button */}
                  <div>
                    {isCurrentPlan ? (
                      <Button
                        disabled
                        className="w-full bg-[#2a2b2b] text-[#9ca3af] cursor-not-allowed"
                      >
                        <Check className="w-5 h-5 mr-2" />
                        Current Plan
                      </Button>
                    ) : plan.id === 'FREE' ? (
                      <Button
                        disabled
                        className="w-full bg-[#2a2b2b] text-[#9ca3af] cursor-not-allowed"
                      >
                        Not Available
                      </Button>
                    ) : plan.id === 'ENTERPRISE' ? (
                      <Button
                        className="w-full bg-linear-to-r from-[#8b5cf6] to-[#6366f1] hover:opacity-90 text-white font-semibold"
                        onClick={() => window.location.href = 'mailto:sales@yourapp.com'}
                      >
                        Contact Sales
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleUpgrade('PRO')}
                        disabled={loading === 'PRO'}
                        className="w-full bg-linear-to-r from-[#50a3f8] to-[#2fabb8] hover:opacity-90 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                      >
                        {loading === 'PRO' ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Crown className="w-5 h-5 mr-2" />
                            {plan.cta}
                          </>
                        )}
                      </Button>
                    )}
                  </div>

                  {/* Features */}
                  <div className="pt-6 border-t border-[#2a2b2b] space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-[#10b981] shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-5 h-5 text-[#6b7280] shrink-0 mt-0.5" />
                        )}
                        <span className={`text-sm ${
                          feature.included ? 'text-[#e5e7eb]' : 'text-[#6b7280]'
                        }`}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Feature Comparison */}
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Compare All Features
          </h2>
          
          <div className="grid grid-cols-3 gap-6">
            <FeatureBlock
              icon={Brain}
              title="AI-Powered Tools"
              description="Leverage advanced AI to optimize your resume, get suggestions, and analyze your content"
              color="from-[#50a3f8] to-[#2fabb8]"
            />
            <FeatureBlock
              icon={TrendingUp}
              title="Analytics & Insights"
              description="Track your resume performance, application status, and get actionable insights"
              color="from-[#8b5cf6] to-[#6366f1]"
            />
            <FeatureBlock
              icon={Shield}
              title="Secure & Private"
              description="Your data is encrypted and secure. We never share your information"
              color="from-[#10b981] to-[#059669]"
            />
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            <FAQItem
              question="Can I cancel anytime?"
              answer="Yes! You can cancel your subscription at any time. Your access will continue until the end of your billing period."
            />
            <FAQItem
              question="What happens to my data if I downgrade?"
              answer="Your data is always safe. If you downgrade, you'll keep all your resumes and applications, but some premium features will be locked."
            />
            <FAQItem
              question="Do AI credits roll over?"
              answer="No, AI credits reset at the beginning of each billing cycle. Use them or lose them!"
            />
            <FAQItem
              question="Is there a free trial?"
              answer="The Free plan is available forever! Upgrade anytime to unlock premium features."
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function FeatureBlock({ 
  icon: Icon, 
  title, 
  description, 
  color 
}: { 
  icon: any
  title: string
  description: string
  color: string
}) {
  return (
    <div className="p-6 rounded-xl border border-[#2a2b2b] bg-[#242525] hover:bg-[#2a2b2b] transition-all">
      <div className={`inline-flex p-3 rounded-lg bg-linear-to-br ${color} mb-4`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-[#9ca3af]">{description}</p>
    </div>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="rounded-lg border border-[#2a2b2b] bg-[#242525] overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-[#2a2b2b] transition-colors"
      >
        <span className="font-semibold text-white">{question}</span>
        <span className="text-[#50a3f8]">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <div className="px-6 py-4 border-t border-[#2a2b2b]">
          <p className="text-[#9ca3af]">{answer}</p>
        </div>
      )}
    </div>
  )
}