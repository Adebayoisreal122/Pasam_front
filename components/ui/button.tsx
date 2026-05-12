'use client'
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:     'bg-gradient-to-r from-green-700 to-green-500 text-white shadow-[0_4px_14px_rgba(22,163,74,0.35)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(22,163,74,0.45)]',
        orange:      'bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-[0_4px_14px_rgba(249,115,22,0.35)] hover:-translate-y-0.5',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:     'border-2 border-green-500 text-green-700 bg-transparent hover:bg-green-50',
        secondary:   'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost:       'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
        link:        'text-green-600 underline-offset-4 hover:underline',
        whatsapp:    'bg-[#25D366] text-white hover:bg-[#20b858]',
      },
      size: {
        default: 'h-11 px-5 py-2.5',
        sm:      'h-9 px-3 text-xs',
        lg:      'h-12 px-8 text-base',
        icon:    'h-9 w-9',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
return (
  <Comp
    className={cn(buttonVariants({ variant, size, className }))}
    ref={ref}
    disabled={disabled || loading}
    {...props}
  >
    <span className="flex items-center justify-center gap-2">
      {loading && (
        <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
      )}
      {children}
    </span>
  </Comp>
)
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
