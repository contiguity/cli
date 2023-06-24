import yargs from 'yargs'
import { sendCommand } from './commands/send.ts'
import { clearKeyCommand, setKeyCommand } from './commands/key.ts'
import { otpCommand } from './commands/otp.ts'

export async function parse(args: string[]) {
  return await yargs(args)
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
    .alias('h', 'help') // -h and -v
    .alias('v', 'version')
    .completion('completion', 'Output the bash completion script') // hidden completion command
    .hide('completion')
    .recommendCommands() // reccomend command when an invalid one is given
    .exitProcess(false) // don't exit proccess after -h or -v
    .strict() // throw errors on unrecongized options
    .parserConfiguration({ // don't parse numbers (loss in accuracy)
      'parse-numbers': false,
    })
    .parse()
}
