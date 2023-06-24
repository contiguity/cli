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
      .option('email', {
        alias: 'e',
        type: 'string',
        describe: 'Send an email to this address',
      })
      .option('email-subject', {
        alias: 's',
        type: 'string',
        describe: 'Email - Subject line',
        implies: 'email',
      })
      .option('email-from', {
        alias: 'f',
        type: 'string',
        describe: 'Email - Sender of the email',
        implies: 'email',
      })
      .option('email-html', {
        alias: 'H',
        type: 'boolean',
        describe: 'Email - Send as HTML',
        implies: 'email',
      })
      .option('email-reply-to', {
        alias: 'r',
        type: 'string',
        describe: 'Email - Reply-to address',
        implies: 'email',
      })
  },
  handler: async (argv: yargsTypes.Arguments) => {
    const [key, mock] = ensureKey(argv)
    const client = (mock ? contiguity.mock : contiguity.login)(key)
    const message = String(argv.message)
    if (!message) throw new Error('A message is required')

    const number = argv.number ? parseNumber(String(argv.number)) : null
    const email = argv.email ? String(argv.email) : null

    if (argv.text) {
      if (!number) throw new Error('A number is required to send a text')
      console.log(await client.send.text({ recipient: number.number, message }))
    }
    if (email) {
      const subject = argv['email-subject']
        ? String(argv['email-subject'])
        : 'Email from Contiguity CLI'
      const from = argv['email-from']
        ? String(argv['email-from'])
        : 'Contiguity'
      const html = !!argv['email-html']
      const replyTo = argv['email-reply-to']
        ? String(argv['email-reply-to'])
        : undefined
      console.log(
        await client.send.email({
          recipient: email,
          from,
          subject,
          text: html ? '' : message,
          html: html ? message : '',
          replyTo,
        }),
      )
    }
  },
}
