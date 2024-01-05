import type yargsTypes from 'yargsTypes'
import { getClient } from '../utils.ts'

export const quotaCommand = {
  command: 'quota',
  describe: 'Get your quota information',
  builder: (yargs: yargsTypes.Argv) => {
    return yargs
      .check((argv) => {
        if (argv.json) {
          throw new Error('JSON output not supported yet for this subcommand.')
        }
        return true
      })
  },
  handler: async (argv: yargsTypes.Arguments) => {
    const client = await getClient(argv)

    const quota = await client.quota.retrieve()

    console.log(quota) // TODO: use logger once this endpoint is fixed
  },
}
