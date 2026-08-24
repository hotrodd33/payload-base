import type { CollectionConfig, TextFieldValidation, UploadFieldValidation } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { slugField } from 'payload'

import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { hasRolePermission } from '../../access/hasRolePermission'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateDelete, revalidateEpisode } from './hooks/revalidateEpisode'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

// The uploaded MP3 is only required when `source` is `upload`. Kept as a
// field-level validation (rather than required: true) because required is
// static and can't see sibling data at config time.
const validateAudioFile: UploadFieldValidation = (value, { siblingData }) => {
  const source = (siblingData as { source?: string } | undefined)?.source

  if (source === 'upload' && !value) {
    return 'Please upload an MP3 file, or switch the source above to "Existing AWS / external URL".'
  }

  return true
}

// The external URL is only required when `source` is `url`, and must look
// like a real URL when present so the frontend player doesn't silently break.
const validateAudioUrl: TextFieldValidation = (value, { siblingData }) => {
  const source = (siblingData as { source?: string } | undefined)?.source

  if (source === 'url') {
    if (!value) {
      return 'Please paste the existing MP3 URL, or switch the source above to "Upload new MP3".'
    }

    try {
      new URL(value)
    } catch {
      return 'Please enter a full, valid URL, including https://'
    }
  }

  return true
}

export const Episodes: CollectionConfig<'episodes'> = {
  slug: 'episodes',
  access: {
    create: hasRolePermission('episodes', 'create'),
    delete: hasRolePermission('episodes', 'delete'),
    read: authenticatedOrPublished,
    update: hasRolePermission('episodes', 'update'),
  },
  defaultPopulate: {
    title: true,
    slug: true,
    coverImage: true,
    publishedDate: true,
    duration: true,
  },
  admin: {
    defaultColumns: ['title', 'episodeNumber', 'publishedDate', '_status'],
    description:
      'Podcast episodes. Upload a new MP3 or link to one already hosted on AWS S3 — either way it plays the same on the site.',
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'episodes',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'episodes',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Episode Title',
      required: true,
      admin: {
        description: 'Shown as the main heading and browser tab title for this episode.',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Episode',
          fields: [
            {
              name: 'coverImage',
              type: 'upload',
              label: 'Cover Image',
              relationTo: 'media',
              filterOptions: {
                mimeType: { contains: 'image' },
              },
              admin: {
                description:
                  'Square artwork for this episode. Falls back to the podcast cover if left blank.',
              },
            },
            {
              name: 'description',
              type: 'richText',
              label: 'Show Notes',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                  ]
                },
              }),
              admin: {
                description: 'Full episode description / show notes, shown on the episode page.',
              },
            },
            {
              name: 'audio',
              type: 'group',
              label: 'Audio',
              admin: {
                description: 'Choose whether to upload a new MP3 or link to one already in S3.',
              },
              fields: [
                {
                  name: 'source',
                  type: 'select',
                  label: 'Audio Source',
                  required: true,
                  defaultValue: 'upload',
                  options: [
                    { label: 'Upload new MP3', value: 'upload' },
                    { label: 'Existing AWS / external URL', value: 'url' },
                  ],
                },
                {
                  name: 'file',
                  type: 'upload',
                  label: 'MP3 File',
                  relationTo: 'media',
                  filterOptions: {
                    mimeType: { contains: 'audio' },
                  },
                  validate: validateAudioFile,
                  admin: {
                    condition: (_, siblingData) => siblingData?.source === 'upload',
                    description: 'Uploads into the same S3 bucket as all other media.',
                  },
                },
                {
                  name: 'url',
                  type: 'text',
                  label: 'AWS S3 / External MP3 URL',
                  validate: validateAudioUrl,
                  admin: {
                    condition: (_, siblingData) => siblingData?.source === 'url',
                    description: 'Paste the full public or CloudFront URL to the existing MP3.',
                  },
                },
              ],
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'publishedDate',
          type: 'date',
          label: 'Published Date',
          required: true,
          admin: {
            width: '50%',
            date: {
              pickerAppearance: 'dayAndTime',
            },
            position: 'sidebar',
          },
        },
        {
          name: 'duration',
          type: 'text',
          label: 'Duration',
          admin: {
            width: '50%',
            description: 'Episode length, e.g. "42:18". Shown next to the player.',
            position: 'sidebar',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'episodeNumber',
          type: 'number',
          label: 'Episode Number',
          admin: {
            width: '50%',
            position: 'sidebar',
          },
        },
        {
          name: 'season',
          type: 'number',
          label: 'Season',
          admin: {
            width: '50%',
            position: 'sidebar',
          },
        },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Featured Episode',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Featured episodes can be highlighted at the top of the podcast archive.',
      },
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidateEpisode],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
