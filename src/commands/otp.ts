import type yargsTypes from 'yargsTypes'
import { Input } from 'cliffyPrompts'
import { getClient, getLogger, parseNumber } from '../utils.ts'
import * as colors from 'std/fmt/colors.ts'

const otpSendCommand = {
  command: 'send <number>',
  describe: 'Send an OTP',
  builder: (yargs: yargsTypes.Argv) => {
    return yargs
      .positional('number', {
        type: 'string',
        describe: 'The phone number to send to',
      })
      .option('name', {
        alias: 'n',
        type: 'string',
        describe: 'The name of the service',
      })
      .option('language', {
        alias: 'l',
        type: 'string',
        default: 'en',
        describe: 'The language to send the OTP in',
      })
      .group(['name', 'language'], 'OTP options:')
  },
  handler: async (argv: yargsTypes.Arguments) => {
    const client = await getClient(argv)
    const logger = getLogger(argv)

    if (!argv.number) throw new Error('You must provide a number to verify.')
    const number = parseNumber(String(argv.number))
    const name = argv.name ? String(argv.name) : undefined
    const language = argv.language ? String(argv.language) : 'en'

    const otpId = await client.otp.send({
      to: number.number,
      language,
      name,
    })
    logger.result(
      `${
        colors.green(`OTP sent to ${number.formatNational()}`)
      }\nOTP ID: ${otpId}`,
      { otpId },
    )
  },
}

const otpVerifyCommand = {
  command: 'verify <otp-id> <otp>',
  describe: 'Verify an OTP',
  builder: (yargs: yargsTypes.Argv) => {
    return yargs
      .positional('otp-id', {
        type: 'string',
        describe: 'The OTP ID to verify',
      })
      .positional('otp', {
        type: 'string',
        describe: 'The OTP to verify',
      })
  },
  handler: async (argv: yargsTypes.Arguments) => {
    const client = await getClient(argv)
    const logger = getLogger(argv)

    if (!argv.otpId) throw new Error('You must provide an OTP ID to verify.')
    if (!argv.otp) throw new Error('You must provide an OTP to verify.')

    const result = await client.otp.verify({
      otp_id: String(argv.otp_id),
      otp: String(argv.otp),
    })
    logger.result(
      `${
        result
          ? colors.green('OTP verified')
          : colors.red('OTP verification failed')
      }`,
      { result },
    )
  },
}

const otpInteractiveCommand = {
  command: '* <number>',
  describe: 'Verify a phone number with an OTP',
  builder: (yargs: yargsTypes.Argv) => {
    return yargs
      .positional('number', {
        type: 'string',
        describe: 'The phone number to verify',
      })
      .option('name', {
        alias: 'n',
        type: 'string',
        describe: 'The name of the service',
      })
      .option('language', {
        alias: 'l',
        type: 'string',
        default: 'en',
        describe: 'The language to send the OTP in',
      })
      .group(['name', 'language'], 'OTP options:')
      .check((argv) => {
        if (argv.json) {
          throw new Error(
            'JSON output is not supported for interactive commands.',
          )
        }
        return true
      })
  },
  handler: async (argv: yargsTypes.Arguments) => {
    const client = await getClient(argv)

    if (!argv.number) throw new Error('You must provide a number to verify.')
    const number = parseNumber(String(argv.number))
    const name = argv.name ? String(argv.name) : undefined
    const language = argv.language ? String(argv.language) : 'en'

    const otpId = await client.otp.send({
      to: number.number,
      language,
      name,
    })

    while (true) {
      const providedOtp = await Input.prompt({
        message: 'Enter the OTP:',
        hint: `It was sent to ${number.formatNational()}`,
      })
      if (!providedOtp) continue
      const verificationResult = await client.otp.verify({
        otp_id: otpId,
        otp: providedOtp,
      })
      if (verificationResult) {
        console.log(
          `${number.country} ${number.formatNational()} has been verified.`,
        )
        break
      } else {
        console.log('The OTP was incorrect. Please try again.')
      }
    }
  },
}

export const otpCommand = {
  command: 'otp',
  describe: 'Send and verify OTPs',
  builder: (yargs: yargsTypes.Argv) => {
    return yargs
      .command(otpInteractiveCommand)
      .command(otpSendCommand)
      .command(otpVerifyCommand)
  },
  handler: () => {},
}
