import type yargsTypes from "yargsTypes"
import { sendSMS, type crumbs } from '../api.ts'
import { ensureKey } from '../config.ts'

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
  handler: (argv: yargsTypes.Arguments) => {
    const [key, mock] = ensureKey(argv)
    let crumbs: crumbs | null = null
    if (argv.sms) {
      const number = String(argv.number)
      const message = String(argv.message)
      crumbs = await sendSMS(number, message, key, mock)
    }
    console.log(crumbs)
  },
}