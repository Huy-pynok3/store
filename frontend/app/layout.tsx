import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import './globals.css'
import Header from '../components/Header'
import Footer from '../components/Footer'

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'TạpHóaMMO - Sàn Thương Mại Điện Tử Sản Phẩm Số #1 Việt Nam',
  description: 'Mua bán email, tài khoản, phần mềm MMO uy tín. Thanh toán tự động, giữ tiền 3 ngày, check trùng sản phẩm. An toàn - Nhanh chóng - Tin cậy.',
  keywords: 'mua bán email, tài khoản facebook, phần mềm MMO, gmail, tài khoản số, dịch vụ MMO',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.ico', sizes: 'any' }
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    title: 'TạpHóaMMO - Sàn TMĐT Sản Phẩm Số #1 Việt Nam',
    description: 'Mua bán email, tài khoản, phần mềm MMO uy tín',
    type: 'website',
    locale: 'vi_VN',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className={roboto.className}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
