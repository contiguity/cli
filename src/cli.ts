import { cli } from './parse.ts'

process.removeAllListeners('warning')

await cli(Deno.args)
