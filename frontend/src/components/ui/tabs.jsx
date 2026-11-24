import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'

export const Tabs = TabsPrimitive.Root

export function TabsList({ className, ...props }) {
  return (
    <TabsPrimitive.List
      className={cn('flex flex-wrap items-center gap-1 border-b border-line', className)}
      {...props}
    />
  )
}

export function TabsTrigger({ className, ...props }) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        'relative -mb-px border-b-2 border-transparent px-3 py-3 text-[0.8125rem] font-semibold text-muted transition-colors hover:text-navy data-[state=active]:border-gold data-[state=active]:text-navy',
        className,
      )}
      {...props}
    />
  )
}

export function TabsContent({ className, ...props }) {
  return <TabsPrimitive.Content className={cn('outline-none', className)} {...props} />
}
