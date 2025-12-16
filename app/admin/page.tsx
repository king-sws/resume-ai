// app/admin/page.tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/db'
import { Users, FileText, Crown, TrendingUp, DollarSign, Zap } from 'lucide-react'

export default async function AdminDashboardPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/auth/sign-in')
  }

  // Get stats
  const [
    totalUsers,
    totalResumes,
    proUsers,
    totalRevenue,
    totalAIInteractions,
    recentUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.resume.count(),
    prisma.user.count({ where: { plan: { in: ['PRO', 'ENTERPRISE'] } } }),
    prisma.subscription.count({ where: { status: 'active' } }),
    prisma.aIInteraction.count(),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        plan: true,
        createdAt: true,
      },
    }),
  ])

  const stats = [
    {
      title: 'Total Users',
      value: totalUsers.toLocaleString(),
      icon: Users,
      color: 'from-[#50a3f8] to-[#2fabb8]',
      change: '+12%',
    },
    {
      title: 'Total Resumes',
      value: totalResumes.toLocaleString(),
      icon: FileText,
      color: 'from-[#10b981] to-[#059669]',
      change: '+23%',
    },
    {
      title: 'Pro Users',
      value: proUsers.toLocaleString(),
      icon: Crown,
      color: 'from-[#f59e0b] to-[#d97706]',
      change: '+8%',
    },
    {
      title: 'Active Subscriptions',
      value: totalRevenue.toLocaleString(),
      icon: DollarSign,
      color: 'from-[#8b5cf6] to-[#6366f1]',
      change: '+15%',
    },
    {
      title: 'AI Interactions',
      value: totalAIInteractions.toLocaleString(),
      icon: Zap,
      color: 'from-[#ec4899] to-[#db2777]',
      change: '+34%',
    },
    {
      title: 'Conversion Rate',
      value: `${((proUsers / totalUsers) * 100).toFixed(1)}%`,
      icon: TrendingUp,
      color: 'from-[#06b6d4] to-[#0891b2]',
      change: '+2%',
    },
  ]

  return (
    <div className="p-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">Overview of your platform metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className="relative p-6 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group overflow-hidden"
            >
              <div className={`absolute inset-0 bg-linear-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
              
              <div className="relative flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg bg-linear-to-br ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-semibold text-[#10b981]">
                  {stat.change}
                </span>
              </div>

              <div className="relative">
                <p className="text-sm text-gray-400 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Users */}
      <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold text-white">Recent Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">User</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Email</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Plan</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Joined</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user) => (
                <tr key={user.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#50a3f8] to-[#2fabb8] flex items-center justify-center text-white font-semibold">
                        {user.name?.[0] || user.email[0].toUpperCase()}
                      </div>
                      <span className="text-white font-medium">{user.name || 'User'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.plan === 'PRO' || user.plan === 'ENTERPRISE'
                        ? 'bg-[#50a3f8]/10 text-[#50a3f8] border border-[#50a3f8]/20'
                        : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                    }`}>
                      {user.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}