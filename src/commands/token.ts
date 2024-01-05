import type yargsTypes from 'yargsTypes'
import { clearStoredToken, getToken, storeToken } from '../config.ts'

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
    const token = await getToken(
      argv.token ? String(argv.token) : undefined,
      true,
    )
    if (token) {
      storeToken(token)
      console.log('The token has been set.')
    } else {
      console.log(
        'You must provide a token. To clear the saved token, use the token clear command.',
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
