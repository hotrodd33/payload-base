import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { Media } from '@/components/Media'
import { NewsletterForm } from './NewsletterForm'
import { SocialIcons } from './SocialIcons'
import type { SiteSetting } from '@/payload-types'

export async function Footer() {
  const footerData = await getCachedGlobal('footer', 2)()
  const siteSettings = await getCachedGlobal('site-settings', 1)()

  const columns = footerData?.columns || []
  const newsletter = footerData?.newsletter
  const socialLinks = footerData?.socialLinks || []
  const copyrightText = footerData?.copyrightText

  const { logo, siteName }: Partial<SiteSetting> = siteSettings || {}

  return (
    <footer className="mt-auto border-t border-border bg-black dark:bg-card text-white">
      <div className="container py-12 flex flex-col gap-10">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between md:gap-16">
          <div className="flex flex-col gap-4 md:max-w-xs">
            <Link className="flex items-center" href="/">
              {logo && typeof logo === 'object' ? (
                <Media
                  className="h-[34px] w-auto max-w-[9.375rem]"
                  imgClassName="h-full w-auto object-contain"
                  resource={logo}
                  alt={siteName || 'Site logo'}
                />
              ) : (
                <Logo />
              )}
            </Link>

            {socialLinks.length > 0 && (
              <SocialIcons className="flex flex-wrap gap-3" links={socialLinks} />
            )}
          </div>

          {columns.length > 0 && (
            <nav className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:flex md:flex-1 md:justify-end">
              {columns.map((column, colIndex) => (
                <div className="flex flex-col gap-3" key={colIndex}>
                  {column.columnTitle && (
                    <span className="text-sm font-semibold text-white">{column.columnTitle}</span>
                  )}
                  <ul className="flex flex-col gap-2">
                    {(column.links || []).map(({ link }, linkIndex) => (
                      <li key={linkIndex}>
                        <CMSLink className="text-sm text-white/70 hover:text-white" {...link} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          )}

          {newsletter?.enabled && (
            <div className="flex flex-col gap-3 md:max-w-sm">
              {newsletter.heading && (
                <span className="text-sm font-semibold text-white">{newsletter.heading}</span>
              )}
              {newsletter.description && (
                <p className="text-sm text-white/70">{newsletter.description}</p>
              )}
              <NewsletterForm />
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse items-start gap-4 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-white/50">
            &copy; {new Date().getFullYear()} {siteName || ''} {copyrightText || 'All rights reserved.'}
          </p>
          <ThemeSelector />
        </div>
      </div>
    </footer>
  )
}
