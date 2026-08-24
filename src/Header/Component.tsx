import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

export async function Header() {
  const headerData = await getCachedGlobal('header', 1)()
  const siteSettings = await getCachedGlobal('site-settings', 1)()

  return <HeaderClient data={headerData} siteSettings={siteSettings} />
}
