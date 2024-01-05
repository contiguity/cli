import type yargsTypes from 'yargsTypes'
import { clearStoredToken, getToken, storeToken } from '../config.ts'
import { getLogger } from '../utils.ts'

export const setTokenCommand = {
  command: 'set-token [token]',
  describe: 'Set a Contiguity API token',
  builder: (yargs: yargsTypes.Argv) => {
    return yargs
      .positional('token', {
        type: 'string',
        describe: 'Your Contiguity token',
      })
  },
  handler: async (argv: yargsTypes.Arguments) => {
    const logger = getLogger(argv)

    const token = await getToken(
      argv.token ? String(argv.token) : undefined,
      true,
      !!argv.json,
    )
    if (token) {
      storeToken(token)
      logger.result('The token has been set.', { success: true })
    } else {
      throw new Error(
        'You must provide a token. To clear the saved token, use the clear-token command.',
      )
    }
  },
}

export const clearTokenCommand = {
  command: 'clear-token',
  describe: 'Clear the stored Contiguity token',
  handler: () => {
    clearStoredToken()
    console.log('The stored token has been cleared.')
  },
}
