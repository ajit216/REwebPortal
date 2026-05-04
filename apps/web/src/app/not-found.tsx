import Link from 'next/link'
import { Building } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 mb-4">
        <Building className="h-8 w-8 text-neutral-400" aria-hidden="true" />
      </div>
      <h1 className="font-heading text-2xl font-bold text-neutral-900 mb-2">Page Not Found</h1>
      <p className="text-neutral-600 max-w-sm mb-6">
        This page doesn't exist. It may have been moved, or you may have typed the URL incorrectly.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button asChild>
          <Link href="/">Back to Home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/projects">Browse Projects</Link>
        </Button>
      </div>
    </div>
  )
}
