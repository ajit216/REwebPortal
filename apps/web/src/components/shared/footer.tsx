import Link from 'next/link'
import { Shield } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-900 text-neutral-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-12 grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Col 1: Platform */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-500">
                <Shield className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="font-heading font-bold text-white text-sm">REwebPortal</span>
            </div>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/about#how-it-works" className="hover:text-white transition-colors">How it Works</Link></li>
              <li><Link href="/about#contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/about#press" className="hover:text-white transition-colors">Press</Link></li>
            </ul>
          </div>

          {/* Col 2: Projects & Builders */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Projects & Builders</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/projects" className="hover:text-white transition-colors">Browse Projects</Link></li>
              <li><Link href="/builders" className="hover:text-white transition-colors">Builder Directory</Link></li>
              <li><Link href="/builders/compare" className="hover:text-white transition-colors">Compare Builders</Link></li>
            </ul>
          </div>

          {/* Col 3: Legal & Tools */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Legal & Tools</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/legal" className="hover:text-white transition-colors">Legal Library</Link></li>
              <li><Link href="/tools/delay-calculator" className="hover:text-white transition-colors">RERA Calculator</Link></li>
              <li><Link href="/legal/templates" className="hover:text-white transition-colors">Templates</Link></li>
              <li><Link href="/legal/experts" className="hover:text-white transition-colors">Expert Network</Link></li>
            </ul>
          </div>

          {/* Col 4: Help */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Help</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/legal/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/about#guidelines" className="hover:text-white transition-colors">Community Guidelines</Link></li>
              <li><Link href="/about#privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/about#terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2025 REwebPortal. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-neutral-500">DPDP Act 2023 Compliant</span>
            <span className="text-neutral-600">·</span>
            <span className="text-neutral-500">Data sourced from MahaRERA & public filings</span>
          </div>
        </div>

        <div className="pb-6 text-xs text-neutral-600">
          <p>
            <strong className="text-neutral-500">Disclaimer:</strong> REwebPortal presents data from publicly available RERA filings and community-reported information. 
            This platform does not provide legal or financial advice. Transparency scores are algorithmic indicators — not editorial opinions. 
            Always verify critical information with official MahaRERA records before making decisions.
          </p>
        </div>
      </div>
    </footer>
  )
}
