import type yargsTypes from 'yargsTypes'
import { getClient } from '../utils.ts'

export const quotaCommand = {
  command: 'quota',
  describe: 'Get your quota information',
  handler: async (argv: yargsTypes.Arguments) => {
    const client = await getClient(argv)

    const quota = await client.quota.retrieve()

    console.log(quota)
  },
}
