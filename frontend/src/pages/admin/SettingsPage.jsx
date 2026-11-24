import { Save } from 'lucide-react'
import { toast } from 'sonner'
import { AdminPanel } from '@/components/admin/AdminUI'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/input'
import { useT } from '@/i18n/LanguageProvider'
import { usePageMeta } from '@/lib/seo'
import { company, contact } from '@/lib/site'

export function SettingsPage() {
  const t = useT()
  usePageMeta({ title: 'Admin settings', description: 'CONSOL administration preview.', noindex: true })

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-[1.5rem] font-semibold tracking-[-0.02em] text-navy">{t('admin.settings.title')}</h2>
        <p className="mt-1 text-[0.8125rem] text-muted">{t('admin.settings.text')}</p>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <AdminPanel title={t('admin.nav.profile')} description="Verified company details (read-only in this preview)">
          <div className="space-y-4 p-5">
            <div>
              <label htmlFor="set-name" className="field-label">
                Legal name
              </label>
              <Input id="set-name" defaultValue={company.legalName} readOnly className="bg-canvas" />
            </div>
            <div>
              <label htmlFor="set-email" className="field-label">
                {t('common.email')}
              </label>
              <Input id="set-email" defaultValue={contact.email} readOnly className="bg-canvas" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="set-landline" className="field-label">
                  {t('common.phone')} · office
                </label>
                <Input id="set-landline" defaultValue={contact.landline} readOnly className="bg-canvas" />
              </div>
              <div>
                <label htmlFor="set-mobile" className="field-label">
                  {t('common.phone')} · mobile
                </label>
                <Input id="set-mobile" defaultValue={contact.mobile} readOnly className="bg-canvas" />
              </div>
            </div>
            <div>
              <label htmlFor="set-address" className="field-label">
                {t('contact.office')}
              </label>
              <Textarea id="set-address" rows={3} defaultValue={contact.addressLines.join('\n')} readOnly className="bg-canvas" />
            </div>
          </div>
        </AdminPanel>

        <div className="space-y-5">
          <AdminPanel title="API connection" description="Environment-configured, never editable in the browser">
            <div className="space-y-4 p-5">
              <div>
                <label htmlFor="set-api" className="field-label">
                  API base URL
                </label>
                <Input
                  id="set-api"
                  defaultValue={import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000/api'}
                  readOnly
                  className="bg-canvas font-mono text-[0.8125rem]"
                />
                <p className="mt-1.5 text-[0.6875rem] text-muted">
                  Configured through <code>VITE_API_BASE_URL</code>. Changes require a deployment.
                </p>
              </div>
              <div>
                <label htmlFor="set-demo" className="field-label">
                  Demo mode
                </label>
                <Input
                  id="set-demo"
                  defaultValue={String(import.meta.env.VITE_ENABLE_DEMO_DATA ?? 'false')}
                  readOnly
                  className="bg-canvas font-mono text-[0.8125rem]"
                />
              </div>
            </div>
          </AdminPanel>

          <AdminPanel title="Localisation">
            <div className="space-y-4 p-5">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <span className="text-[0.8125rem] text-ink">English</span>
                <span className="text-[0.6875rem] font-semibold text-success">Published</span>
              </div>
              <div className="flex items-center justify-between border-b border-line pb-3">
                <span className="text-[0.8125rem] text-ink">አማርኛ (Amharic)</span>
                <span className="text-[0.6875rem] font-semibold text-gold-deep">Interface ready · content review pending</span>
              </div>
              <p className="text-[0.6875rem] leading-relaxed text-muted">
                Company statements remain in their published English wording until a reviewed Amharic version is
                supplied.
              </p>
              <Button
                size="sm"
                onClick={() => toast.success('Demo action — nothing was saved')}
              >
                <Save className="size-3.5" aria-hidden="true" />
                {t('admin.save')}
              </Button>
            </div>
          </AdminPanel>
        </div>
      </div>
    </div>
  )
}
