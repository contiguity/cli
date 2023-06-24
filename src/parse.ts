// @deno-types="yargsTypes"
import yargs from 'yargs'
import { sendCommand } from './commands/send.ts'
import { clearKeyCommand, setKeyCommand } from './commands/key.ts'
import { otpCommand } from './commands/otp.ts'
import { quotaCommand } from './commands/quota.ts'

export async function parse(args: string[]) {
  const parser = yargs(args)
    .scriptName('contiguity') // assume contiguity is the name of the command
    .option('key', { // global options
      alias: 'k',
      describe: 'Your Contiguity key',
      type: 'string',
    })
    .option('mock', {
      alias: 'm',
      type: 'boolean',
      describe: 'Mock all API requests, key not needed',
    })
    .option('debug', {
      alias: 'd',
      type: 'boolean',
      describe: 'Print debug information',
    })
    .command(sendCommand) // register commands
    .command(setKeyCommand)
    .command(clearKeyCommand)
    .command(otpCommand)
    .command(quotaCommand)
    .alias('h', 'help') // -h and -v
    .alias('v', 'version')
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
  
  // dnt-shim-ignore
  // deno-lint-ignore no-explicit-any
  if ((globalThis as any)?.process?.env) parser.env('CONTIGUITY') // Use CONTIGUITY_* env vars in Node.js

  return await parser.parse()
}
