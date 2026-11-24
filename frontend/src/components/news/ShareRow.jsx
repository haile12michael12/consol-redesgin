import { Check, Copy, Facebook, Linkedin, Mail, Twitter } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useT } from '@/i18n/LanguageProvider'

/** Social sharing controls for articles and events. */
export function ShareRow({ title }) {
  const t = useT()
  const [copied, setCopied] = useState(false)
  const url = typeof window !== 'undefined' ? window.location.href : ''
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const links = [
    { Icon: Linkedin, label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` },
    { Icon: Twitter, label: 'X', href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}` },
    { Icon: Facebook, label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { Icon: Mail, label: 'Email', href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}` },
  ]

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success('Link copied')
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Could not copy the link')
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2 border-t border-line pt-5">
      <span className="mr-1 text-[0.5625rem] font-bold uppercase tracking-[0.14em] text-muted">
        {t('news.share')}
      </span>
      {links.map(({ Icon, label, href }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={label}
          className="grid size-9 place-items-center border border-line text-muted transition-colors hover:border-navy hover:bg-navy hover:text-white"
        >
          <Icon className="size-3.5" aria-hidden="true" />
        </a>
      ))}
      <button
        type="button"
        onClick={copy}
        className="inline-flex h-9 items-center gap-1.5 border border-line px-3 text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-muted transition-colors hover:border-navy hover:text-navy"
      >
        {copied ? <Check className="size-3.5 text-success" aria-hidden="true" /> : <Copy className="size-3.5" aria-hidden="true" />}
        {copied ? 'Copied' : 'Copy link'}
      </button>
    </div>
  )
}
