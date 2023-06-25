import type yargsTypes from 'yargsTypes'
import { clearStoredKey, getKey, storeKey } from '../config.ts'

export const setKeyCommand = {
  command: 'set-key [key]',
  describe: 'Set a Contiguity API key',
  builder: (yargs: yargsTypes.Argv) => {
    return yargs
      .positional('key', {
        type: 'string',
        describe: 'Your Contiguity key',
      })
  },
  handler: async (argv: yargsTypes.Arguments) => {
    const key = await getKey(argv.key ? String(argv.key) : undefined, true)
    if (key) {
      storeKey(key)
      console.log('The key has been set.')
    } else {
      console.log(
        'You must provide a key. To clear the saved key, use the clear-key command.',
      )
    }
  },
}

export const clearKeyCommand = {
  command: 'clear-key',
  describe: 'Clear the stored Contiguity key',
  handler: () => {
    clearStoredKey()
    console.log('The stored key has been cleared.')
  },
}
