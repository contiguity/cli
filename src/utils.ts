import parsePhoneNumber from 'libphonenumber-js'
import type yargsTypes from 'yargsTypes'
// temp type override until sourfruit merges my PR
// @deno-types="./contiguity-javascript.d.ts"
import contiguity from '@contiguity/javascript'
import { ensureToken } from './config.ts'

type PhoneNumber = {
  countryCallingCode: string
  country?: string
  nationalNumber: string
  number: string
  carrierCode?: string
  ext?: string
  setExt(ext: string): void
  getPossibleCountries(): string[]
  isPossible(): boolean
  isValid(): boolean
  getType(): string | undefined
  format(format: string, options?: unknown): string
  formatNational(options?: unknown): string
  formatInternational(options?: unknown): string
  getURI(options?: unknown): string
  isNonGeographic(): boolean
  isEqual(phoneNumber: PhoneNumber): boolean
}

export const parseNumber = (input: string) => {
  const parsed: PhoneNumber | undefined = parsePhoneNumber(input, 'US' as const)
  if (!(parsed && parsed.isPossible())) {
    throw new Error(`Invalid phone number: ${input}`)
  }
  if (!parsed.isValid()) {
    console.warn(
      `Phone number may not be valid: ${parsed.country} ${parsed.formatNational()} (If it is, you may need to update)`,
    )
  }
  return parsed
}

export const getClient = async (argv: yargsTypes.Arguments) => {
  const [token, mock] = await ensureToken(argv)
  const client = (mock ? contiguity.mock : contiguity.login)(
    token,
    !!argv.debug,
  )
  return client
}
