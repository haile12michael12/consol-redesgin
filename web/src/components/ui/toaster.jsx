import { Toaster as Sonner } from 'sonner'

/** Brand-styled toast surface. Mounted once in App. */
export function Toaster() {
  return (
    <Sonner
      position="bottom-right"
      gap={10}
      toastOptions={{
        classNames: {
          toast:
            'group rounded-[3px] border border-line bg-white text-ink shadow-[0_24px_60px_-28px_rgba(16,29,50,0.45)]',
          title: 'text-[0.875rem] font-semibold text-navy',
          description: 'text-[0.8125rem] text-muted',
          success: '[&_[data-icon]]:text-success',
          error: '[&_[data-icon]]:text-danger',
          actionButton: 'bg-navy text-white rounded-[2px]',
          closeButton: 'border-line bg-white text-muted',
        },
      }}
    />
  )
}
