import { redirect } from 'next/navigation'

// Canonical URL is /admin/verifications
export default function AdminVerificationRedirectPage() {
  redirect('/admin/verifications')
}
