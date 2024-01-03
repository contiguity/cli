import { cli } from './parse.ts'

// remove Node's warning about experimental features (fetch)
import process from 'node:process'
process.removeAllListeners('warning')

await cli(Deno.args)
