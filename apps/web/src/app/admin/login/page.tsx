import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Login | REwebPortal',
  robots: 'noindex, nofollow',
}

// This page is intentionally not linked from any public nav
// Admins access it directly at /admin/login
export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-sm space-y-6">
        <div className="text-center">
          <p className="text-xs text-neutral-400 uppercase tracking-widest mb-1">REwebPortal</p>
          <h1 className="text-xl font-bold text-neutral-900">Admin Login</h1>
          <p className="text-sm text-neutral-500 mt-1">Internal access only</p>
        </div>

        {/* TODO: Wire up to NextAuth credentials provider with email+password */}
        <form className="space-y-4" action="/api/auth/signin/credentials" method="POST">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Admin Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="admin@rewebportal.in"
              required
              autoComplete="email"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-neutral-900 text-white text-sm font-semibold rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Log In
          </button>
        </form>

        <p className="text-xs text-neutral-400 text-center">
          Admin accounts are provisioned manually.
          <br />
          Forgotten password? Contact the platform owner.
        </p>
      </div>
    </div>
  )
}
