import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2.5 whitespace-nowrap font-semibold tracking-[0.02em] transition-all duration-200 ease-[cubic-bezier(0.22,0.61,0.36,1)] select-none focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-gold disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-55 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary:
          'bg-navy text-white hover:bg-navy-800 active:bg-navy-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]',
        gold: 'bg-gold text-navy hover:bg-gold-soft active:bg-gold-deep active:text-white',
        outline:
          'border border-line-strong bg-transparent text-navy hover:border-navy hover:bg-navy hover:text-white',
        'outline-invert':
          'border border-white/35 bg-transparent text-white hover:border-white hover:bg-white hover:text-navy',
        ghost: 'bg-transparent text-navy hover:bg-canvas',
        'ghost-invert': 'bg-transparent text-white hover:bg-white/10',
        link: 'bg-transparent text-navy underline-offset-4 hover:text-gold-deep hover:underline',
        nav: 'bg-transparent text-navy font-medium hover:text-gold-deep',
      },
      size: {
        sm: 'h-9 px-4 text-[0.75rem] uppercase tracking-[0.12em]',
        md: 'h-11 px-6 text-[0.8125rem]',
        lg: 'h-[3.25rem] px-8 text-[0.8125rem]',
        icon: 'size-10',
        none: '',
      },
      shape: {
        square: 'rounded-[3px]',
        pill: 'rounded-full',
        text: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      shape: 'square',
    },
  },
)

/**
 * Primary action primitive.
 * `asChild` lets a Router <Link> keep its own semantics while inheriting styles.
 */
export function Button({
  className,
  variant,
  size,
  shape,
  asChild = false,
  type = 'button',
  ...props
}) {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, shape }), className)}
      {...(asChild ? {} : { type })}
      {...props}
    />
  )
}

export { buttonVariants }
