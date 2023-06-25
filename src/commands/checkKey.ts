import type yargsTypes from 'yargsTypes'
// temp type override until sourfruit merges my PR
// @deno-types="../contiguity-javascript.d.ts"
import contiguity from '@contiguity/javascript'
import { getKey, storeKey } from '../config.ts'

export const checkKeyCommand = {
  command: 'check-key',
  describe: 'Make sure there is a valid key stored',
  handler: async (argv: yargsTypes.Arguments) => {
    const storedKey = await getKey(undefined, false, true)

    if (!storedKey) {
      const providedKey = await getKey(
        argv.mock ? 'mock' : undefined,
        false,
        true,
      )
      if (!providedKey) throw new Error('You must provide a key.')

      if (!argv.mock) {
        const client = contiguity.login(providedKey, !!argv.debug)
        await client.quota.retrieve()
      }
      storeKey(providedKey)
    } else if (!argv.mock && storedKey !== 'mock') {
      const client = contiguity.login(storedKey, !!argv.debug)
      await client.quota.retrieve()
    }
  },
}
