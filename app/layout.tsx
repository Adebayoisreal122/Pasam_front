import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/context/AuthContext'
import { CartProvider } from '@/context/CartContext'

export const metadata: Metadata = {
  title: 'PASAM Store — Fresh Food Packages Delivered',
  description: 'Affordable food packages for students, families, singles & organizations. Doorstep delivery across Nigeria.',
  keywords: 'food packages, Nigeria, student pack, family pack, Ibadan, food delivery',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
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
