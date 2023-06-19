import type yargsTypes from 'yargsTypes'
import { join } from 'path'

const homeDir = Deno.build.os === 'windows' ? Deno.env.get('USERPROFILE') : Deno.env.get('HOME')
export const configDir = join(homeDir, '.contiguity')

const keyPath = join(configDir, 'key')
export function storeKey(key: string) {
  // TODO: make this work via a config file
  Deno.writeTextFileSync(keyPath, key)
}
export function clearStoredKey() {
  Deno.removeFileSync(keyPath)
}

export function getKey(givenKey?: string, noStored?: boolean) {
  if (givenKey) return givenKey
  if (!noStored) {
    const storedKey = Deno.readTextFileSync(keyPath).trim()
    if (storedKey) return storedKey
  }
  const providedKey = prompt('Contiguity API key:')
  if (providedKey) return providedKey
  return null
}

export function ensureKey(argv: yargsTypes.Arguments): [ key: string, mock: boolean ] {
  const givenKey = 'key' in argv ? String(argv.key) : undefined
  const mock = 'mock' in argv ? !!argv.mock : false

  const key = getKey(mock ? 'mock' : givenKey)
  if (!key) throw new Error('A key is required because one is not saved and --mock was not used.')
  
  return [key, key === 'mock']
}