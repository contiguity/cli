#!/usr/bin/env node
import yargs from 'https://deno.land/x/yargs/deno.ts'
import type { Arguments, Argv } from 'https://deno.land/x/yargs/deno-types.ts'
import { sendSMS } from './api.ts'

const sendCommand = {
  command: ['send <message>', '* <message>'],
  describe: 'Send a message',
  builder: (yargs: Argv) => {
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
        type: 'boolean',
        describe: 'Send an SMS message',
        implies: 'number',
      })
  },
  handler: (argv: Arguments) => {
    return argv
  }
}

const argv = yargs(Deno.args)
  .option('key', {
    alias: 'k',
    describe: 'Your Contiguity key',
    type: 'string',
  })
  .option('simulate', {
    alias: 's',
    type: 'boolean',
    describe: 'Simulate all API requests',
  })
  .command(sendCommand)
  .parserConfig({
    'parse-numbers': false,
  })
  .parse()

console.log(argv)