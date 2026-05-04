import { Info } from 'lucide-react'

interface DataDisclaimerProps {
  lastUpdated?: string
  source?: string
  extraNote?: string
}

export function DataDisclaimer({ lastUpdated, source = 'MahaRERA', extraNote }: DataDisclaimerProps) {
  return (
    <div className="flex items-start gap-2 rounded-lg bg-neutral-50 border border-neutral-200 px-4 py-3 text-xs text-neutral-500">
      <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
      <p>
        Data sourced from {source} and public filings.
        {lastUpdated && ` Last synced: ${lastUpdated}.`}
        {extraNote && ` ${extraNote}`}
        {' '}
        <a href="https://maharera.mahaonline.gov.in" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline">
          Verify on MahaRERA ↗
        </a>
      </p>
    </div>
  )
}
