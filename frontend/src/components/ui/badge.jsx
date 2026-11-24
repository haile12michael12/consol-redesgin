import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-[2px] border px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-[0.13em] leading-5',
  {
    variants: {
      variant: {
        gold: 'border-gold/45 bg-gold/12 text-gold-deep',
        navy: 'border-navy bg-navy text-white',
        outline: 'border-line-strong bg-transparent text-muted',
        positive: 'border-success/35 bg-success/8 text-success',
        demo: 'border-gold/60 bg-gold text-navy',
        invert: 'border-white/30 bg-white/10 text-white',
      },
    },
    defaultVariants: { variant: 'outline' },
  },
)

export function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { badgeVariants }
