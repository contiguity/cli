import type yargsTypes from 'yargsTypes'
// temp type override until sourfruit merges my PR
// @deno-types="../contiguity-javascript.d.ts"
import contiguity from '@contiguity/javascript'
import { ensureKey } from '../config.ts'
import parsePhoneNumber from 'libphonenumber-js'

const parseNumber = (input: string) => {
  const parsed = parsePhoneNumber(input, 'US' as const)
  if (!(parsed && parsed.isPossible())) {
    throw new Error(`Invalid phone number: ${input}`)
  }
  if (!parsed.isValid()) {
    console.warn(
      `Phone number may not be valid: ${parsed.country} ${parsed.formatNational()} (If it is, you may need to update)`,
    )
  }
  return parsed
}

type crumbs = {
  plan: string
  quota: number
  type: string
  ad: boolean
}

export const sendCommand = {
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
      .option('text', {
        alias: 't',
        type: 'boolean',
        describe: 'Send a text message',
        implies: 'number',
      })
  },
  handler: async (argv: yargsTypes.Arguments) => {
    const [key, mock] = ensureKey(argv)
    const client = (mock ? contiguity.mock : contiguity.login)(key)
    const message = String(argv.message)
    const number = argv.number ? parseNumber(String(argv.number)) : null
    let response: unknown = null
    if (argv.text) {
      if (!number) throw new Error('A number is required to send a text')
      response = await client.send.text({ recipient: number.number, message })
    }
    console.log(response)
  },
}
