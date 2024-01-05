import type yargsTypes from 'yargsTypes'
import { getClient, getLogger, parseNumber } from '../utils.ts'
import type { emailResult, smsResult } from '../apiTypes.ts'
import * as colors from 'std/fmt/colors.ts'

export const sendCommand = {
  command: '* <message>',
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
      .group(['number', 'text'], 'Phone options:')
      .option('email', {
        alias: 'e',
        type: 'string',
        describe: 'Send an email to this address',
      })
      .option('subject', {
        alias: 's',
        type: 'string',
        describe: 'Subject line',
        implies: 'email',
      })
      .option('from', {
        alias: 'f',
        type: 'string',
        describe: 'Sender of the email',
        implies: 'email',
      })
      .option('html', {
        alias: 'H',
        type: 'boolean',
        describe: 'Send email as HTML',
        implies: 'email',
      })
      .option('reply-to', {
        alias: 'r',
        type: 'string',
        describe: 'Reply-to address',
        implies: 'email',
      })
      .group(['email', 'subject', 'from', 'html', 'reply-to'], 'Email options:')
  },
  handler: async (argv: yargsTypes.Arguments) => {
    const client = await getClient(argv)
    const logger = getLogger(argv)

    const message = String(argv.message)
    if (!message) throw new Error('A message is required')

    const number = argv.number ? parseNumber(String(argv.number)) : null
    const email = argv.email ? String(argv.email) : null

    const resultJson: { text?: unknown; email?: unknown } = {}

    if (argv.text) {
      if (!number) throw new Error('A number is required to send a text')
      const result = await client.send.text({
        to: number.number,
        message,
      }) as smsResult

      logger.log(
        colors.green(`Text message sent to ${number.formatNational()}`),
      )
      logger.log(`Plan: ${result.crumbs.plan}`)
      logger.log(
        `Quota: ${result.crumbs.quota}${
          'remaining' in result.crumbs
            ? `/${result.crumbs.quota + result.crumbs.remaining}`
            : ''
        }`,
      )
      logger.log(`Ad: ${result.crumbs.ad}`)
      resultJson.text = result
    }
    if (email) {
      const subject = argv.subject
        ? String(argv.subject)
        : 'Email from Contiguity CLI'
      const from = argv.from ? String(argv.from) : 'Contiguity CLI'
      const html = !!argv.html
      const replyTo = argv.replyTo ? String(argv.replyTo) : undefined
      const result = await client.send.email({
        to: email,
        from,
        subject,
        text: html ? '' : message,
        html: html ? message : '',
        replyTo,
      }) as emailResult

      logger.log(colors.green(`Email sent to ${email}`))
      logger.log(`Plan: ${result.crumbs.plan}`)
      logger.log(
        `Quota: ${result.crumbs.quota}${
          'remaining' in result.crumbs
            ? `/${result.crumbs.quota + result.crumbs.remaining}`
            : ''
        }`,
      )
      logger.log(`Ad: ${result.crumbs.ad}`)
      resultJson.email = result
    }

    logger.json(resultJson)
  },
}
