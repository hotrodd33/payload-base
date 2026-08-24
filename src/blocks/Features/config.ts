import type { Block, Field } from 'payload'

export const featureIconOptions = [
  { label: 'Zap', value: 'zap' },
  { label: 'Shield', value: 'shield' },
  { label: 'Rocket', value: 'rocket' },
  { label: 'Star', value: 'star' },
  { label: 'Heart', value: 'heart' },
  { label: 'Check Circle', value: 'check-circle' },
  { label: 'Globe', value: 'globe' },
  { label: 'Trending Up', value: 'trending-up' },
  { label: 'Users', value: 'users' },
  { label: 'Award', value: 'award' },
  { label: 'Lightbulb', value: 'lightbulb' },
  { label: 'Settings', value: 'settings' },
  { label: 'Sparkles', value: 'sparkles' },
  { label: 'Layers', value: 'layers' },
]

const featureFields: Field[] = [
  {
    name: 'mediaType',
    type: 'radio',
    admin: {
      layout: 'horizontal',
    },
    defaultValue: 'icon',
    options: [
      {
        label: 'Icon',
        value: 'icon',
      },
      {
        label: 'Image',
        value: 'image',
      },
    ],
  },
  {
    name: 'icon',
    type: 'select',
    admin: {
      condition: (_, siblingData) => siblingData?.mediaType === 'icon',
    },
    defaultValue: 'zap',
    options: featureIconOptions,
  },
  {
    name: 'image',
    type: 'upload',
    admin: {
      condition: (_, siblingData) => siblingData?.mediaType === 'image',
    },
    relationTo: 'media',
  },
  {
    name: 'title',
    type: 'text',
    required: true,
  },
  {
    name: 'description',
    type: 'textarea',
  },
]

export const Features: Block = {
  slug: 'features',
  interfaceName: 'FeaturesBlock',
  labels: {
    singular: 'Features / Grid',
    plural: 'Features / Grid Blocks',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      options: [
        {
          label: '2 Columns',
          value: '2',
        },
        {
          label: '3 Columns',
          value: '3',
        },
        {
          label: '4 Columns',
          value: '4',
        },
      ],
    },
    {
      name: 'features',
      type: 'array',
      admin: {
        initCollapsed: true,
      },
      labels: {
        singular: 'Feature',
        plural: 'Features',
      },
      minRows: 1,
      fields: featureFields,
    },
  ],
}
