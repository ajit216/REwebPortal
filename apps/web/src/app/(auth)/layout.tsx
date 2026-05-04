import { Navbar } from '@/components/shared/navbar'
import { Footer } from '@/components/shared/footer'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}
