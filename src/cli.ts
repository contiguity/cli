import { cli } from './parse.ts'
import * as colors from 'std/fmt/colors.ts'

// remove Node's warning about experimental features (fetch)
import process from 'node:process'
process.removeAllListeners('warning')

// disable stack traces in V8
// see https://v8.dev/docs/stack-trace-api
Error.stackTraceLimit = 0

// custom error handler for Node
function errorHandler(error: unknown) {
  const errorText = error instanceof Error
    ? `${error.name !== 'Error' ? `${error.name}: ` : ''}${error.message}`
    : String(error)
  const tip = `Use ${
    colors.bold('--help')
  } for more information on how to use this command. For more help, visit ${
    colors.underline('https://docs.contiguity.co/#/cli/')
  }.`
  console.error(
    `${colors.red('Error:')} ${errorText}${
      tip ? `\n\n${colors.yellow('Tip:')} ${tip}` : ''
    }`,
  )
  process.exit(1)
}
process.on('uncaughtException', errorHandler)
process.on('unhandledRejection', errorHandler)

await cli(Deno.args)
