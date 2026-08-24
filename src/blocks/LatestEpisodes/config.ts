import type { Block } from 'payload'

export const LatestEpisodes: Block = {
  slug: 'latestEpisodes',
  interfaceName: 'LatestEpisodesBlock',
  labels: {
    plural: 'Latest Episodes Blocks',
    singular: 'Latest Episodes',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      defaultValue: 'Latest Episodes',
      admin: {
        description: 'Shown above the list of episodes on this page.',
      },
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Number of Episodes',
      defaultValue: 3,
      min: 1,
      max: 12,
      admin: {
        description: 'How many recent podcast episodes to show, newest first.',
        step: 1,
      },
    },
    {
      name: 'featuredOnly',
      type: 'checkbox',
      label: 'Only Show Featured Episodes',
      defaultValue: false,
      admin: {
        description: 'When checked, only episodes marked "Featured Episode" will be shown.',
      },
    },
  ],
}
