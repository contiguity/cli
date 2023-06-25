import type yargsTypes from 'yargsTypes'
import { Input } from 'cliffyPrompts'
import { join } from 'path'

const homeDir = Deno.build.os === 'windows'
  ? Deno.env.get('USERPROFILE') || 'C:\\Program Files'
  : Deno.env.get('HOME') || '~'
export const configDir = join(homeDir, '.contiguity')

const keyPath = join(configDir, 'key')
export function storeKey(key: string) {
  Deno.mkdirSync(configDir, { recursive: true })
  Deno.writeTextFileSync(keyPath, key, { create: true })
}
export function clearStoredKey() {
  Deno.removeSync(keyPath)
}

export async function getKey(
  givenKey?: string,
  noStored?: boolean,
  noPrompt?: boolean,
) {
  if (givenKey) return givenKey
  if (!noStored) {
    try {
      const storedKey = Deno.readTextFileSync(keyPath).trim()
      if (storedKey) return storedKey
    } catch {
      // the key has not been set
    }
  }
  if (!noPrompt) {
    const providedKey = await Input.prompt({
      message: 'Contiguity API key',
      hint:
        'Generate a revokable token at https://contiguity.co/dashboard/tokens.',
      maxLength: 21,
      suggestions: ['mock'],
    })
    if (providedKey) return providedKey
  }
  return null
}

export async function ensureKey(
  argv: yargsTypes.Arguments,
): Promise<[key: string, mock: boolean]> {
  const givenKey = 'key' in argv ? String(argv.key) : undefined
  const mock = 'mock' in argv ? !!argv.mock : false

  const key = await getKey(mock ? 'mock' : givenKey)
  if (!key) {
    throw new Error(
      'A key is required because one is not saved and --mock was not used.',
    )
  }

  return [key, key === 'mock']
}
