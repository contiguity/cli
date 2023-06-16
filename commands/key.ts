import type yargsTypes from "https://esm.sh/v125/@types/yargs@17.0.24/index.d.ts"
import { getKey, storeKey, clearStoredKey } from '../config.ts'

export const setKeyCommand = {
  command: 'set-key [key]',
  describe: 'Set a Contiguity API key',
  builder: (yargs: yargsTypes.Argv) => {
    return yargs
      .positional('key', {
        type: 'string',
        describe: 'Your Contiguity key'
      })
  },
  handler: (argv: yargsTypes.Arguments) => {
    const key = getKey(String(argv.key), true)
    if (key) {
      storeKey(key)
      console.log('The key has been set.')
    } else {
      console.log('You must provide a key. To clear the saved key, use the clear-key command.')
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