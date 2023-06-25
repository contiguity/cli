import type yargsTypes from 'yargsTypes'
import { Input } from 'cliffyPrompts'
import { join } from 'path'

const homeDir = Deno.build.os === 'windows'
  ? Deno.env.get('USERPROFILE') || 'C:\\Program Files'
  : Deno.env.get('HOME') || '~'
export const configDir = join(homeDir, '.contiguity')

const tokenPath = join(configDir, 'token')
export function storeToken(token: string) {
  Deno.mkdirSync(configDir, { recursive: true })
  Deno.writeTextFileSync(tokenPath, token, { create: true })
}
export function clearStoredToken() {
  Deno.removeSync(tokenPath)
}

export async function getToken(
  givenToken?: string,
  noStored?: boolean,
  noPrompt?: boolean,
) {
  if (givenToken) return givenToken
  if (!noStored) {
    try {
      const storedToken = Deno.readTextFileSync(tokenPath).trim()
      if (storedToken) return storedToken
    } catch {
      // the token has not been set
    }
  }
  if (!noPrompt) {
    const providedToken = await Input.prompt({
      message: 'Contiguity API token',
      hint:
        'Generate a revokable token at https://contiguity.co/dashboard/tokens.',
      maxLength: 21,
      suggestions: ['mock'],
    })
    if (providedToken) return providedToken
  }
  return null
}

export async function ensureToken(
  argv: yargsTypes.Arguments,
): Promise<[token: string, mock: boolean]> {
  const givenToken = 'token' in argv ? String(argv.token) : undefined
  const mock = 'mock' in argv ? !!argv.mock : false

  const token = await getToken(mock ? 'mock' : givenToken)
  if (!token) {
    throw new Error(
      'A token is required because one is not saved and --mock was not used.',
    )
  }

  return [token, token === 'mock']
}
