import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Accordion = AccordionPrimitive.Root

export function AccordionItem({ className, ...props }) {
  return (
    <AccordionPrimitive.Item
      className={cn('border-b border-line last:border-b-0', className)}
      {...props}
    />
  )
}

export function AccordionTrigger({ className, children, ...props }) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          'group flex flex-1 items-start justify-between gap-6 py-5 text-left text-[1.0625rem] font-semibold text-navy transition-colors hover:text-gold-deep [&[data-state=open]>svg]:rotate-45',
          className,
        )}
        {...props}
      >
        {children}
        <Plus className="mt-1 size-4 shrink-0 text-gold-deep transition-transform duration-300" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

export function AccordionContent({ className, children, ...props }) {
  return (
    <AccordionPrimitive.Content
      className="overflow-hidden text-[0.9375rem] leading-relaxed text-muted data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      {...props}
    >
      <div className={cn('pb-6 pr-10', className)}>{children}</div>
    </AccordionPrimitive.Content>
  )
}
