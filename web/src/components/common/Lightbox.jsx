import * as DialogPrimitive from '@radix-ui/react-dialog'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { useT } from '@/i18n/LanguageProvider'

/**
 * Keyboard-navigable image viewer. Arrow keys move between images, Escape closes.
 */
export function Lightbox({ images = [], index = 0, open, onOpenChange }) {
  const t = useT()
  const [current, setCurrent] = useState(index)

  useEffect(() => {
    if (open) setCurrent(index)
  }, [open, index])

  const step = useCallback(
    (direction) => {
      setCurrent((value) => (value + direction + images.length) % images.length)
    },
    [images.length],
  )

  if (!images.length) return null

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-navy/95 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className="fixed inset-0 z-50 flex flex-col outline-none"
          onKeyDown={(event) => {
            if (event.key === 'ArrowRight') step(1)
            if (event.key === 'ArrowLeft') step(-1)
          }}
        >
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-3 text-white">
            <DialogPrimitive.Title className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-white/70">
              {t('common.lightbox')} — {current + 1} / {images.length}
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="sr-only">
              {images[current]?.alt}
            </DialogPrimitive.Description>
            <DialogPrimitive.Close
              className="grid size-10 place-items-center text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              aria-label={t('common.close')}
            >
              <X className="size-5" />
            </DialogPrimitive.Close>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center p-4 sm:p-10">
            <img
              src={images[current]?.src}
              alt={images[current]?.alt ?? ''}
              className="max-h-full max-w-full object-contain shadow-2xl"
            />
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label={t('common.previous')}
                  className="absolute left-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center bg-navy/70 text-white transition-colors hover:bg-gold hover:text-navy sm:left-6"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label={t('common.next')}
                  className="absolute right-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center bg-navy/70 text-white transition-colors hover:bg-gold hover:text-navy sm:right-6"
                >
                  <ChevronRight className="size-5" />
                </button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="no-scrollbar flex justify-center gap-2 overflow-x-auto border-t border-white/10 px-4 py-4">
              {images.map((image, itemIndex) => (
                <button
                  key={image.src + itemIndex}
                  type="button"
                  onClick={() => setCurrent(itemIndex)}
                  className={cn(
                    'h-12 w-16 shrink-0 overflow-hidden border-2 transition-opacity',
                    itemIndex === current ? 'border-gold' : 'border-transparent opacity-50 hover:opacity-100',
                  )}
                  aria-label={`${t('common.image')} ${itemIndex + 1}`}
                  aria-current={itemIndex === current}
                >
                  <img src={image.src} alt="" className="h-full w-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
