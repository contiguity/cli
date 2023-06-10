#!/usr/bin/env node
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { sendSMS } from './api.ts'

yargs(hideBin(process.argv))
  .option('key', {
    alias: 'k',
    describe: 'Your Contiguity key',
    type: 'string',
  })
  .command(
    'sms <number> <message>',
    'Send an SMS message to the provided phone number',
    yargs => {
      yargs.positional('number', {
        type: 'string',
        describe: 'The phone number to send to',
      }).positional('message', {
        type: 'string',
        describe: 'The message to send',
      })
    },
    async ({ number, message, string }: { number: number, message: string, key?: string }) => {
      const crumbs = await sendSMS(number, message, key)
    }
  )