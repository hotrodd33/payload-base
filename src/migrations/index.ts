import * as migration_20260822_153228_init from './20260822_153228_init';
import * as migration_20260822_232425_add_new_blocks from './20260822_232425_add_new_blocks';
import * as migration_20260822_235605_add_analytics_fields from './20260822_235605_add_analytics_fields';
import * as migration_20260823_000000_add_roles_collection from './20260823_000000_add_roles_collection';

export const migrations = [
  {
    up: migration_20260822_153228_init.up,
    down: migration_20260822_153228_init.down,
    name: '20260822_153228_init',
  },
  {
    up: migration_20260822_232425_add_new_blocks.up,
    down: migration_20260822_232425_add_new_blocks.down,
    name: '20260822_232425_add_new_blocks',
  },
  {
    up: migration_20260822_235605_add_analytics_fields.up,
    down: migration_20260822_235605_add_analytics_fields.down,
    name: '20260822_235605_add_analytics_fields'
  },
  {
    up: migration_20260823_000000_add_roles_collection.up,
    down: migration_20260823_000000_add_roles_collection.down,
    name: '20260823_000000_add_roles_collection'
  },
];

