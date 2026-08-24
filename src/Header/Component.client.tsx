'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header, SiteSetting } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { Media } from '@/components/Media'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
  siteSettings?: SiteSetting | null
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, siteSettings }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  const logo = siteSettings?.logo

  return (
    <header className="container relative z-20   " {...(theme ? { 'data-theme': theme } : {})}>
      <div className="py-8 flex justify-between">
        <Link href="/">
          {logo && typeof logo === 'object' ? (
            <Media
              className="h-[34px] w-auto max-w-[9.375rem]"
              imgClassName="h-full w-auto object-contain"
              resource={logo}
              alt={siteSettings?.siteName || 'Site logo'}
              priority
              loading="eager"
            />
          ) : (
            <Logo loading="eager" priority="high" className="invert dark:invert-0" />
          )}
        </Link>
        <HeaderNav data={data} />
      </div>
    </header>
  )
}
