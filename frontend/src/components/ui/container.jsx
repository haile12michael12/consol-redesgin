import { cn } from '@/lib/utils'

const sizes = {
  wide: 'shell shell-wide',
  default: 'shell',
  tight: 'shell shell-tight',
  full: 'w-full px-5 sm:px-8 lg:px-12',
}

export function Container({ as: Tag = 'div', size = 'wide', className, ...props }) {
  return <Tag className={cn(sizes[size], className)} {...props} />
}
