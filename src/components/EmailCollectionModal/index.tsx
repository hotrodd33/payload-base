'use client'

import type { FormFieldBlock, Form as FormType } from '@payloadcms/plugin-form-builder/types'

import { usePathname } from 'next/navigation'
import Image from 'next/image'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import FocusTrap from 'focus-trap-react'
import { X } from 'lucide-react'

import RichText from '@/components/RichText'
import { Button } from '@/components/ui/button'
import { fields } from '@/blocks/Form/fields'
import { getClientSideURL } from '@/utilities/getURL'
import {
  EMAIL_MODAL_DISMISSED_COOKIE,
  EMAIL_MODAL_DISMISSED_DAYS,
  EMAIL_MODAL_SUBMITTED_COOKIE,
  EMAIL_MODAL_SUBMITTED_DAYS,
  getCookie,
  setCookie,
} from '@/utilities/emailModalCookies'
import type { Media, Page, SiteSetting } from '@/payload-types'

export type EmailCollectionModalProps = {
  settings: NonNullable<SiteSetting['emailCollectionModal']>
}

/**
 * Resolves whether the modal is allowed to render on the current route, based
 * on the "Show On" setting configured in Site Settings. This only decides
 * eligibility — the delay/scroll trigger and cookie checks happen separately.
 */
function isAllowedOnCurrentPage(
  settings: EmailCollectionModalProps['settings'],
  pathname: string,
): boolean {
  const targeting = settings.pageTargeting || 'all'

  if (targeting === 'all') return true
  if (targeting === 'homepage') return pathname === '/'

  if (targeting === 'specific') {
    const specificPages = settings.specificPages || []
    return specificPages.some((page) => {
      const slug = typeof page === 'object' ? (page as Page)?.slug : undefined
      return Boolean(slug) && pathname === `/${slug}`
    })
  }

  return false
}

export const EmailCollectionModal: React.FC<EmailCollectionModalProps> = ({ settings }) => {
  const pathname = usePathname()
  const [shouldRender, setShouldRender] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const {
    enabled,
    triggerType,
    triggerValue,
    headline,
    description,
    image,
    form: formData,
    successMessageOverride,
  } = settings

  const form = (typeof formData === 'object' ? formData : null) as FormType | null

  // Decide, on mount, whether this visitor is even eligible to see the modal at all
  // (respecting the dismiss/submit cookies and page targeting) before wiring up its trigger.
  useEffect(() => {
    if (!enabled || !form) return
    if (!isAllowedOnCurrentPage(settings, pathname)) return
    if (getCookie(EMAIL_MODAL_DISMISSED_COOKIE)) return
    if (getCookie(EMAIL_MODAL_SUBMITTED_COOKIE)) return

    setShouldRender(true)
  }, [enabled, form, settings, pathname])

  // Wire up the configured trigger (time delay or scroll percentage) once eligible.
  useEffect(() => {
    if (!shouldRender) return

    if (triggerType === 'scroll') {
      const thresholdPercent = triggerValue ?? 50

      const handleScroll = () => {
        const scrollTop = window.scrollY
        const docHeight = document.documentElement.scrollHeight - window.innerHeight
        const scrolledPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 100

        if (scrolledPercent >= thresholdPercent) {
          setIsVisible(true)
          window.removeEventListener('scroll', handleScroll)
        }
      }

      window.addEventListener('scroll', handleScroll, { passive: true })
      return () => window.removeEventListener('scroll', handleScroll)
    }

    // Default: time delay (seconds)
    const delayMs = (triggerValue ?? 8) * 1000
    const timer = setTimeout(() => setIsVisible(true), delayMs)
    return () => clearTimeout(timer)
  }, [shouldRender, triggerType, triggerValue])

  const handleDismiss = useCallback(() => {
    setCookie(EMAIL_MODAL_DISMISSED_COOKIE, '1', EMAIL_MODAL_DISMISSED_DAYS)
    setIsVisible(false)
  }, [])

  // Close on ESC key
  useEffect(() => {
    if (!isVisible) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleDismiss()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isVisible, handleDismiss])

  if (!isVisible || !form) return null

  return (
    <FocusTrap
      active={isVisible}
      focusTrapOptions={{ initialFocus: () => closeButtonRef.current || false }}
    >
      <div
        aria-modal="true"
        role="dialog"
        aria-labelledby="email-collection-modal-heading"
        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) handleDismiss()
        }}
      >
        <div className="relative w-full max-w-lg overflow-hidden rounded-lg bg-background shadow-xl">
          <button
            ref={closeButtonRef}
            type="button"
            onClick={handleDismiss}
            aria-label="Close popup"
            className="absolute right-3 top-3 z-10 rounded-full bg-background/80 p-1.5 text-foreground hover:bg-accent"
          >
            <X className="size-5" />
          </button>

          {image && typeof image === 'object' && (image as Media).url && (
            <div className="relative h-40 w-full">
              <Image
                alt={(image as Media).alt || ''}
                src={(image as Media).url as string}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="p-6 sm:p-8">
            {headline && (
              <h2 id="email-collection-modal-heading" className="mb-2 text-2xl font-semibold">
                {headline}
              </h2>
            )}
            {description && <p className="mb-6 text-muted-foreground">{description}</p>}

            <ModalForm
              form={form}
              successMessageOverride={successMessageOverride}
              onSuccess={() => {
                setCookie(EMAIL_MODAL_SUBMITTED_COOKIE, '1', EMAIL_MODAL_SUBMITTED_DAYS)
              }}
            />
          </div>
        </div>
      </div>
    </FocusTrap>
  )
}

/**
 * Renders and submits the selected Payload Form via the native form-submissions
 * endpoint (same mechanism as the page-builder Form block) — no custom form logic.
 */
const ModalForm: React.FC<{
  form: FormType
  successMessageOverride?: string | null
  onSuccess: () => void
}> = ({ form, successMessageOverride, onSuccess }) => {
  const formMethods = useForm({ defaultValues: form.fields })
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = formMethods

  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [error, setError] = useState<string | undefined>()

  const onSubmit = useCallback(
    (data: FormFieldBlock[]) => {
      const submitForm = async () => {
        setError(undefined)
        setIsLoading(true)

        const dataToSend = Object.entries(data).map(([name, value]) => ({ field: name, value }))

        try {
          const req = await fetch(`${getClientSideURL()}/api/form-submissions`, {
            body: JSON.stringify({
              form: form.id,
              submissionData: dataToSend,
            }),
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
          })

          const res = await req.json()
          setIsLoading(false)

          if (req.status >= 400) {
            setError(res.errors?.[0]?.message || 'Something went wrong. Please try again.')
            return
          }

          setHasSubmitted(true)
          onSuccess()
        } catch {
          setIsLoading(false)
          setError('Something went wrong. Please try again.')
        }
      }

      void submitForm()
    },
    [form, onSuccess],
  )

  if (hasSubmitted) {
    return (
      <div className="text-center">
        {successMessageOverride ? (
          <p>{successMessageOverride}</p>
        ) : (
          <RichText data={form.confirmationMessage} />
        )}
      </div>
    )
  }

  return (
    <FormProvider {...formMethods}>
      {error && <div className="mb-4 text-sm text-destructive">{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4 last:mb-0">
          {form.fields?.map((field, index) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const Field: React.FC<any> = fields?.[field.blockType as keyof typeof fields]
            if (!Field) return null
            return (
              <div className="mb-4 last:mb-0" key={index}>
                <Field
                  form={form}
                  {...field}
                  {...formMethods}
                  control={control}
                  errors={errors}
                  register={register}
                />
              </div>
            )
          })}
        </div>
        <Button type="submit" variant="default" disabled={isLoading} className="w-full">
          {isLoading ? 'Submitting...' : form.submitButtonLabel || 'Submit'}
        </Button>
      </form>
    </FormProvider>
  )
}
