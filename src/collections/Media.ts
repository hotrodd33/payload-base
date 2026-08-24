import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import { anyone } from '../access/anyone'
import { hasRolePermission } from '../access/hasRolePermission'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  folders: true,
  access: {
    create: hasRolePermission('media', 'create'),
    delete: hasRolePermission('media', 'delete'),
    read: anyone,
    update: hasRolePermission('media', 'update'),
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alt Text',
      admin: {
        description:
          'A short description of the image for screen readers and search engines, e.g. "Team photo at the 2024 conference." Leave blank only for purely decorative images.',
      },
      //required: true,
    },
    {
      name: 'caption',
      type: 'richText',
      label: 'Caption',
      admin: {
        description: 'Optional text shown alongside the image where captions are supported.',
      },
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
  ],
  upload: {
    // Upload to the public/media directory in Next.js making them publicly accessible even outside of Payload
    staticDir: path.resolve(dirname, '../../public/media'),
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    // Accept images (site/episode artwork) and audio (podcast episodes). Sizing/focal
    // point only apply to images — Payload skips them automatically for audio uploads.
    mimeTypes: ['image/*', 'audio/*'],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
      },
      {
        name: 'square',
        width: 500,
        height: 500,
      },
      {
        name: 'small',
        width: 600,
      },
      {
        name: 'medium',
        width: 900,
      },
      {
        name: 'large',
        width: 1400,
      },
      {
        name: 'xlarge',
        width: 1920,
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        crop: 'center',
      },
    ],
  },
}
