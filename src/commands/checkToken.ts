import type yargsTypes from 'yargsTypes'
// temp type override until sourfruit merges my PR
// @deno-types="../contiguity-javascript.d.ts"
import contiguity from '@contiguity/javascript'
import { getToken, storeToken } from '../config.ts'

export const checkTokenCommand = {
  command: 'check-token',
  describe: 'Make sure there is a valid token stored',
  handler: async (argv: yargsTypes.Arguments) => {
    const storedToken = await getToken(undefined, false, true)

    if (!storedToken) {
      const providedToken = await getToken(
        argv.mock ? 'mock' : undefined,
        false,
        true,
      )
      if (!providedToken) throw new Error('You must provide a token.')

      if (!argv.mock) {
        const client = contiguity.login(providedToken, !!argv.debug)
        await client.quota.retrieve()
      }
      storeToken(providedToken)
    } else if (!argv.mock && storedToken !== 'mock') {
      const client = contiguity.login(storedToken, !!argv.debug)
      await client.quota.retrieve()
    }
  },
}
