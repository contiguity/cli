import yargs from "https://deno.land/x/yargs@v17.7.2-deno/deno.ts"
import type yargsTypes from "https://esm.sh/v125/@types/yargs@17.0.24/index.d.ts"
import { sendSMS, type crumbs } from './api.ts'

function storeKey(key: string) {
  localStorage.setItem('contiguity-cli-key', key)
}
function clearStoredKey() {
  localStorage.removeItem('contiguity-cli-key')
}
function getKey(givenKey?: string, noStored?: boolean) {
  if (givenKey) return givenKey
  if (!noStored) {
    const storedKey = localStorage.getItem('contiguity-cli-key')
    if (storedKey) return storedKey
  }
  const providedKey = prompt('Contiguity API key:')
  if (providedKey) return providedKey
  return null
}

function ensureKey(argv: yargsTypes.Arguments): Promise<[ key: string, mock: boolean ]> {
  const givenKey = 'key' in argv ? String(argv.key) : undefined
  const mock = 'mock' in argv ? !!argv.mock : false

  const key = getKey(mock ? 'mock' : givenKey)
  if (!key) throw new Error('A key is required because one is not saved and --mock was not used.')
  
  return [key, key === 'mock']
}

async function sendHandler(argv: yargsTypes.Arguments) {
  const [key, mock] = ensureKey(argv)
  let crumbs: crumbs | null = null
  if (argv.sms) {
    const number = String(argv.number)
    const message = String(argv.message)
    crumbs = await sendSMS(number, message, key, mock)
  }
  console.log(crumbs)
}

function setKeyHandler(argv: yargsTypes.Arguments) {
  const key = getKey(String(argv.key), true)
  if (key) {
    storeKey(key)
    console.log('The key has been set.')
  } else {
    console.log('You must provide a key. To clear the saved key, use the clear-key command.')
  }
}
function clearKeyHandler() {
  clearStoredKey()
  console.log('The stored key has been cleared.')
}


const sendCommand = {
  command: ['send <message>', '* <message>'],
  describe: 'Send a message',
  builder: (yargs: yargsTypes.Argv) => {
    return yargs
      .positional('message', {
        type: 'string',
        describe: 'The message to send',
      })
      .option('number', {
        alias: 'n',
        type: 'string',
        describe: 'The phone number to send to',
      })
      .option('sms', {
        alias: 's',
        type: 'boolean',
        describe: 'Send an SMS message',
        implies: 'number',
      })
  },
  handler: sendHandler,
}

const setKeyCommand = {
  command: 'set-key [key]',
  describe: 'Set a Contiguity API key',
  builder: (yargs: yargsTypes.Argv) => {
    return yargs
      .positional('key', {
        type: 'string',
        describe: 'Your Contiguity key'
      })
  },
  handler: setKeyHandler,
}

const clearKeyCommand = {
  command: 'clear-key',
  describe: 'Clear the stored Contiguity key',
  handler: clearKeyHandler,
}

const argv = await yargs(Deno.args)
  .option('key', {
    alias: 'k',
    describe: 'Your Contiguity key',
    type: 'string',
  })
  .option('mock', {
    alias: 'm',
    type: 'boolean',
    describe: 'Mock all API requests, key not needed',
  })
  .command(sendCommand)
  .command(setKeyCommand)
  .command(clearKeyCommand)
  .alias('h', 'help')
  .alias('v', 'version')
  .parserConfiguration({
    'parse-numbers': false,
  })
  .parse()