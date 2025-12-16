// components/settings/AccountSettings.tsx
'use client'

import { useState } from 'react'
import { Shield, Trash2, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { SignOut } from '@/actions/auth'

interface AccountSettingsProps {
  user: {
    id: string
    email: string
    plan: string
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscription: any
}

export function AccountSettings({ user, subscription }: AccountSettingsProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch('/api/user/delete-account', {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete account')

      toast.success('Account deleted successfully')
      await SignOut()
    } catch (error) {
      toast.error('Failed to delete account')
      console.error(error)
      setIsDeleting(false)
    }
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl  p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Shield className="w-5 h-5 text-white/90" />
        <h2 className="text-xl font-semibold text-white/90">Account Management</h2>
      </div>

      <div className="space-y-6">
        {/* Account Info */}
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-sm text-white/90">User ID</span>
            <span className="text-sm font-mono text-white/90">{user.id}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-sm text-white/90">Email</span>
            <span className="text-sm text-white/90">{user.email}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-sm text-white/90">Plan</span>
            <span className="text-sm text-white/90 capitalize">{user.plan.toLowerCase()}</span>
          </div>
          {subscription && (
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-sm text-white/90">Subscription Status</span>
              <span className={`text-sm capitalize ${
                subscription.status === 'active' ? 'text-green-600' : 'text-white/90'
              }`}>
                {subscription.status}
              </span>
            </div>
          )}
        </div>

        {/* Danger Zone */}
        <div className="border-t border-slate-200 pt-6">
          <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-red-900 mb-1">Delete Account</h4>
                <p className="text-sm text-red-700 mb-4">
                  Once you delete your account, there is no going back. This will permanently 
                  delete all your resumes, data, and cancel any active subscriptions.
                </p>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={isDeleting}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription className="space-y-2">
                        <p>
                          This action cannot be undone. This will permanently delete your account 
                          and remove all your data from our servers.
                        </p>
                        <p className="font-semibold text-red-600">
                          All of your resumes, templates, and AI interactions will be lost forever.
                        </p>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isDeleting}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        {isDeleting ? 'Deleting...' : 'Yes, delete my account'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}