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
  const isChatBoxPage = pathname.startsWith('/chat-box')

  return (
    <>
      <OAuthHandler />
      {!hideSiteChrome && <Header />}
      <div className={hideSiteChrome || isChatBoxPage ? '' : 'pb-[56px] sm:pb-0'}>{children}</div>
      {!hideSiteChrome && !isChatBoxPage && <Footer />}
      {!hideSiteChrome && !isChatBoxPage && <FloatingAuctionBar />}
      {!hideSiteChrome && !isChatBoxPage && <ScrollTopButton />}
      <InitialPageLoader />
    </>
  )
}
