// app/dashboard/upgrade/success/page.tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, Sparkles, ArrowRight, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function UpgradeSuccessPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/auth/sign-in')
  }

  return (
    <div className="min-h-screen bg-[#191a1a] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <div className="relative p-12 rounded-2xl border border-[#2a2b2b] bg-[#242525] text-center overflow-hidden">
          {/* Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#50a3f8]/5 to-[#2fabb8]/5" />
          
          {/* Content */}
          <div className="relative space-y-6">
            {/* Success Icon */}
            <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-[#10b981] to-[#059669] mx-auto">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>

            {/* Heading */}
            <div>
              <h1 className="text-4xl font-bold text-white mb-3">
                Welcome to Pro! 🎉
              </h1>
              <p className="text-xl text-[#9ca3af]">
                Your subscription has been activated successfully
              </p>
            </div>

            {/* Features Unlocked */}
            <div className="p-6 rounded-xl bg-[#2a2b2b] border border-[#3a3b3b] text-left">
              <div className="flex items-center gap-2 mb-4">
                <Crown className="w-5 h-5 text-[#50a3f8]" />
                <h3 className="font-semibold text-white">Features Unlocked:</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  'Unlimited Resumes',
                  '100 AI Credits/month',
                  'Premium Templates',
                  'Advanced Analytics',
                  'Priority Support',
                  'Version History',
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#50a3f8]" />
                    <span className="text-sm text-[#e5e7eb]">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Steps */}
            <div className="space-y-3">
              <p className="text-sm text-[#9ca3af]">
                Ready to make the most of your Pro subscription?
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/dashboard">
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-[#50a3f8] to-[#2fabb8] hover:opacity-90 text-white">
                    Go to Dashboard
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                
                <Link href="/dashboard/templates">
                  <Button 
                    variant="outline"
                    className="w-full sm:w-auto border-[#2a2b2b] text-[#9ca3af] hover:bg-[#2a2b2b]"
                  >
                    Browse Premium Templates
                  </Button>
                </Link>
              </div>
            </div>

            {/* Support */}
            <p className="text-sm text-[#6b7280] pt-6 border-t border-[#2a2b2b]">
              Questions? Contact us at{' '}
              <a href="mailto:support@yourapp.com" className="text-[#50a3f8] hover:underline">
                support@yourapp.com
              </a>
            </p>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-8 p-6 rounded-xl border border-[#2a2b2b] bg-[#242525]">
          <h3 className="font-semibold text-white mb-4">Quick Tips to Get Started:</h3>
          <ol className="space-y-3 text-sm text-[#9ca3af]">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#50a3f8]/10 text-[#50a3f8] flex items-center justify-center font-semibold">
                1
              </span>
              <span>Create unlimited resumes tailored for different job applications</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#50a3f8]/10 text-[#50a3f8] flex items-center justify-center font-semibold">
                2
              </span>
              <span>Use AI credits to enhance your resume content and get professional suggestions</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#50a3f8]/10 text-[#50a3f8] flex items-center justify-center font-semibold">
                3
              </span>
              <span>Explore premium templates to stand out from other candidates</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#50a3f8]/10 text-[#50a3f8] flex items-center justify-center font-semibold">
                4
              </span>
              <span>Track your job applications and monitor your progress</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  )
}