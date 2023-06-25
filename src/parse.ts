// @deno-types="yargsTypes"
import yargs from 'yargs'
import { sendCommand } from './commands/send.ts'
import { clearTokenCommand, setTokenCommand } from './commands/token.ts'
import { checkTokenCommand } from './commands/checkToken.ts'
import { otpCommand } from './commands/otp.ts'
import { quotaCommand } from './commands/quota.ts'

const examples: [command: string, description: string][] = [
  [
    '$0 set-token',
    'Set token before using other commands',
  ],
  [
    '$0 --number "(234) 567-8910" --text "Hello, world!"',
    'Send a text message',
  ],
  [
    '$0 -tn +12345678910 "Hello, world!"',
    'Same but with shorthands',
  ],
  [
    '$0 --email "user@example.com" "Hello, world!"',
    'Send a basic email',
  ],
  [
    '$0 otp "(234) 567-8910"',
    'Verify phone number with OTP',
  ],
  [
    '$0 quota',
    'Check your account quota',
  ],
  [
    'CONTIGUITY_NUMBER=2345678910 CONTIGUITY_TEXT=1 contiguity "Hi"',
    'Set any option with env vars',
  ],
]

// Some slightly ugly code to make the help output look nice cross-platform
// dnt-shim-ignore
// deno-lint-ignore no-explicit-any
const processSupported = !!(globalThis as any)?.process
const terminalWidth = processSupported
  // dnt-shim-ignore
  // deno-lint-ignore no-explicit-any
  ? (globalThis as any).process?.stdout.columns as number
  // dnt-shim-ignore
  // deno-lint-ignore no-explicit-any
  : ((globalThis as any).Deno.consoleSize() as {
    rows: number
    columns: number
  }).columns

export async function cli(args: string[] = Deno.args) {
  const parser = yargs(args)
    .scriptName('contiguity') // assume contiguity is the name of the command
    .option('token', { // global options
      alias: 'k',
      describe: 'Your Contiguity token',
      type: 'string',
    })
    .option('mock', {
      alias: 'm',
      type: 'boolean',
      describe: 'Mock all API requests, token not needed',
    })
    .option('debug', {
      alias: 'd',
      type: 'boolean',
      describe: 'Print debug information',
    })
    .command(sendCommand) // register commands
    .command(otpCommand)
    .command(setTokenCommand)
    .command(clearTokenCommand)
    .command(checkTokenCommand)
    .command(quotaCommand)
    .alias('h', 'help') // -h and -v
    .alias('v', 'version')
    .example(examples) // examples
    .completion('completion', false) // hidden completion command
    .recommendCommands() // reccomend command when an invalid one is given
    .exitProcess(false) // don't exit proccess after -h or -v
    .strict() // throw errors on unrecongized options
    .parserConfiguration({ // don't parse numbers (loss in accuracy)
      'parse-numbers': false,
      'parse-positional-numbers': false,
      'strip-aliased': false,
      'strip-dashed': false,
    })
    .wrap(terminalWidth ?? null) // wrap help text to terminal width

  if (processSupported) parser.env('CONTIGUITY') // Use CONTIGUITY_* env vars in Node.js

  return await parser.parse()
}
