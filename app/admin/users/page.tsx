// app/admin/users/page.tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/db'
import { Search, Crown, Mail } from 'lucide-react'

export default async function AdminUsersPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/auth/sign-in')
  }

  const [users, stats] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        usageStats: true,
        subscription: {
          select: {
            status: true,
            currentPeriodEnd: true,
          },
        },
      },
    }),
    prisma.user.groupBy({
      by: ['plan'],
      _count: true,
    }),
  ])

  const planStats = stats.reduce((acc, item) => {
    acc[item.plan] = item._count
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Users</h1>
        <p className="text-gray-400">Manage platform users</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <p className="text-sm text-gray-400 mb-1">Total Users</p>
          <p className="text-3xl font-bold text-white">{users.length}</p>
        </div>
        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <p className="text-sm text-gray-400 mb-1">Free Users</p>
          <p className="text-3xl font-bold text-gray-400">
            {planStats.FREE || 0}
          </p>
        </div>
        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <p className="text-sm text-gray-400 mb-1">Pro Users</p>
          <p className="text-3xl font-bold text-[#50a3f8]">
            {planStats.PRO || 0}
          </p>
        </div>
        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <p className="text-sm text-gray-400 mb-1">Enterprise</p>
          <p className="text-3xl font-bold text-[#8b5cf6]">
            {planStats.ENTERPRISE || 0}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search users..."
          className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#50a3f8]"
        />
      </div>

      {/* Users Table */}
      <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">User</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Plan</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Resumes</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">AI Credits</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#50a3f8] to-[#2fabb8] flex items-center justify-center text-white font-semibold">
                        {user.name?.[0] || user.email[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white font-medium">{user.name || 'User'}</p>
                        <p className="text-sm text-gray-400 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                      user.plan === 'PRO' || user.plan === 'ENTERPRISE'
                        ? 'bg-[#50a3f8]/10 text-[#50a3f8] border border-[#50a3f8]/20'
                        : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                    }`}>
                      {(user.plan === 'PRO' || user.plan === 'ENTERPRISE') && (
                        <Crown className="w-3 h-3" />
                      )}
                      {user.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {user.usageStats?.resumesCreated || 0} / {user.usageStats?.resumesLimit === -1 ? '∞' : user.usageStats?.resumesLimit || 1}
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {user.usageStats?.aiCreditsUsed || 0} / {user.usageStats?.aiCreditsLimit || 10}
                  </td>
                  <td className="px-6 py-4">
                    {user.subscription?.status === 'active' ? (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20">
                        Active
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-500/10 text-gray-400 border border-gray-500/20">
                        {user.subscription?.status || 'Free'}
                      </span>
                    )}
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