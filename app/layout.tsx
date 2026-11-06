import type { Metadata, Viewport } from 'next'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/context/AuthContext'
import { CartProvider } from '@/context/CartContext'
import ServiceWorkerRegister from '@/components/pwa/ServiceWorkerRegister'
import './globals.css'

    export const metadata: Metadata = {
      title: 'PASAM Store — Fresh Food Packages Delivered',
      description: 'Affordable food packages for students, families, singles & organizations. Doorstep delivery across Nigeria.',
      manifest: '/manifest.json',
      appleWebApp: { capable: true, title: 'PASAM', statusBarStyle: 'default' },
      icons: {
        icon: '/icons/favicon-192x192.png',
        apple: '/icons/apple-touch-icon.png',
      },
    }

    export const viewport: Viewport = {
      themeColor: '#16a34a',
      width: 'device-width',
      initialScale: 1,
    }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ServiceWorkerRegister />
        <AuthProvider>
          <CartProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  fontFamily: 'Inter, sans-serif',
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                },
                success: { iconTheme: { primary: '#16a34a', secondary: '#fff' } },
              }}
            />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
