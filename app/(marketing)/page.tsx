// app/(marketing)/page.tsx
import { HeroSection } from '@/components/landing/HeroSection'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { ResumeOptimizationSection } from '@/components/landing/HowItWorksSection'
import { TemplatesSection } from '@/components/landing/TemplatesSection'
import { PricingSection } from '@/components/landing/PricingSection'
import { StatsSection } from '@/components/landing/StatsSection'
import { CTASection } from '@/components/landing/CTASection'
import { FAQSection } from '@/components/landing/FAQSection'
import  LandingHeader  from '@/components/landing/LandingHeader'
import { LandingFooter } from '@/components/landing/LandingFooter'
import {CoachingBanner} from '@/components/landing/CoachingBanner'
import { ExpertAdviceSection } from '@/components/landing/ExpertAdviceSection'
import TestimonialsSection from '@/components/landing/TestimonialsSection'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <LandingHeader />
      
      <main>
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <ResumeOptimizationSection />
        <CoachingBanner />
        <TemplatesSection />
        <TestimonialsSection />
        <PricingSection />
        <ExpertAdviceSection />
        <FAQSection />
        <CTASection />
      </main>

      <LandingFooter />
    </div>
  )
}