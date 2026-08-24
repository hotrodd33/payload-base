'use client'
import { Footer } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const ColumnRowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<NonNullable<Footer['columns']>[number]>()

  const label = data?.data?.columnTitle
    ? data.data.columnTitle
    : `Column ${data.rowNumber !== undefined ? data.rowNumber + 1 : ''}`

  return <div>{label}</div>
}
