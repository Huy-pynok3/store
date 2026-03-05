'use client'

import { usePathname } from 'next/navigation'
import Header from '../Header'
import Footer from '../Footer'
import FloatingAuctionBar from '../FloatingAuctionBar'
import ScrollTopButton from '../ScrollTopButton'
import InitialPageLoader from '../InitialPageLoader'
import OAuthHandler from '../OAuthHandler'

interface RouteChromeProps {
  children: React.ReactNode
}

export default function RouteChrome({ children }: RouteChromeProps) {
  const pathname = usePathname() || ''
  const hideSiteChrome = pathname.startsWith('/quan-ly-cua-hang')

  return (
    <>
      <OAuthHandler />
      {!hideSiteChrome && <Header />}
      <div className={hideSiteChrome ? '' : 'pb-[56px] sm:pb-0'}>{children}</div>
      {!hideSiteChrome && <Footer />}
      {!hideSiteChrome && <FloatingAuctionBar />}
      {!hideSiteChrome && <ScrollTopButton />}
      <InitialPageLoader />
    </>
  )
}
