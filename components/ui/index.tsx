'use client'
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// ── Input ──
const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        'flex h-11 w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2 text-sm transition-all',
        'placeholder:text-gray-400',
        'focus:outline-none focus:border-green-500 focus:shadow-[0_0_0_3px_rgba(34,197,94,0.15)]',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50',
        className
      )}
      ref={ref}
      {...props}
    />
  )
)
Input.displayName = 'Input'

// ── Textarea ──
const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      className={cn(
        'flex w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm transition-all resize-none',
        'placeholder:text-gray-400',
        'focus:outline-none focus:border-green-500 focus:shadow-[0_0_0_3px_rgba(34,197,94,0.15)]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref}
      {...props}
    />
  )
)
Textarea.displayName = 'Textarea'

// ── Label ──
const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn('block text-sm font-semibold text-gray-700 mb-1.5', className)}
    {...props}
  />
))
Label.displayName = 'Label'

// ── Select ──
const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select
      className={cn(
        'flex h-11 w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2 text-sm transition-all cursor-pointer',
        'focus:outline-none focus:border-green-500 focus:shadow-[0_0_0_3px_rgba(34,197,94,0.15)]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  )
)
Select.displayName = 'Select'

// ── Badge ──
const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default:     'bg-green-100 text-green-700',
        orange:      'bg-orange-100 text-orange-700',
        blue:        'bg-blue-100 text-blue-700',
        purple:      'bg-purple-100 text-purple-700',
        red:         'bg-red-100 text-red-700',
        gray:        'bg-gray-100 text-gray-600',
        outline:     'border border-current text-current',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = ({ className, variant, ...props }: BadgeProps) => (
  <div className={cn(badgeVariants({ variant }), className)} {...props} />
)

// ── Card ──
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('bg-white rounded-2xl shadow-[0_4px_16px_-2px_rgba(0,0,0,0.08)] overflow-hidden', className)} {...props} />
  )
)
Card.displayName = 'Card'

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-5 border-b border-gray-100', className)} {...props} />
  )
)
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('font-display font-bold text-base text-gray-800', className)} {...props} />
  )
)
CardTitle.displayName = 'CardTitle'

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-5', className)} {...props} />
  )
)
CardContent.displayName = 'CardContent'

// ── Spinner ──
const Spinner = ({ className }: { className?: string }) => (
  <div className={cn('w-8 h-8 border-3 border-gray-200 border-t-green-500 rounded-full animate-spin', className)} />
)

// ── PageLoader ──
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <Spinner className="w-10 h-10 border-4" />
  </div>
)

export { Input, Textarea, Label, Select, Badge, badgeVariants, Card, CardHeader, CardTitle, CardContent, Spinner, PageLoader }
