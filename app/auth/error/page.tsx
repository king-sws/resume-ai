
// app/auth/error/page.tsx
import Link from "next/link"
import { AlertCircle } from "lucide-react"

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  const error = searchParams.error

  const errorMessages: Record<string, string> = {
    Configuration: "There is a problem with the server configuration.",
    AccessDenied: "You do not have permission to sign in.",
    Verification: "The verification token has expired or has already been used.",
    OAuthSignin: "Error in constructing an authorization URL.",
    OAuthCallback: "Error in handling the response from an OAuth provider.",
    OAuthCreateAccount: "Could not create OAuth provider user in the database.",
    EmailCreateAccount: "Could not create email provider user in the database.",
    Callback: "Error in the OAuth callback handler route.",
    OAuthAccountNotLinked: "Email already exists with a different sign in method.",
    SessionRequired: "Please sign in to access this page.",
    Default: "An error occurred during authentication.",
  }

  const errorMessage = error ? errorMessages[error] || errorMessages.Default : errorMessages.Default

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-center mb-6">
          <AlertCircle className="h-12 w-12 text-red-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-4">
          Authentication Error
        </h1>
        
        <p className="text-center text-gray-600 mb-8">
          {errorMessage}
        </p>

        <div className="space-y-3">
          <Link
            href="/auth/login"
            className="block w-full text-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            Try again
          </Link>
          
          <Link
            href="/"
            className="block w-full text-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Go to homepage
          </Link>
        </div>
      </div>
    </div>
  )
}