import type yargsTypes from 'yargsTypes'
import { Input } from 'cliffyPrompts'
import { join } from 'std/path/mod.ts'

/** Gets the config directory for the current user */
function osConfigDir() {
  switch (Deno.build.os) {
    case 'windows':
      return Deno.env.get('APPDATA') || 'C:\\Program Files'

    case 'darwin': {
      const home = Deno.env.get('HOME') || '~'
      return join(home, 'Library', 'Preferences')
    }

    case 'linux':
    default: {
      const xdgConfigDir = Deno.env.get('XDG_CONFIG_HOME')
      if (xdgConfigDir) return xdgConfigDir

      const home = Deno.env.get('HOME') || '~'
      return join(home, '.config')
    }
  }
}

export const configDir = join(osConfigDir(), '.contiguity')

// Move the old config directory if it exists
// This code is temporary and can be removed in a future release
const oldDir = join(
  Deno.build.os === 'windows'
    ? Deno.env.get('USERPROFILE') || 'C:\\Program Files'
    : Deno.env.get('HOME') || '~',
  '.contiguity',
)
try {
  if (Deno.statSync(oldDir).isDirectory) {
    Deno.renameSync(oldDir, configDir)
  }
} catch {
  // the old directory does not exist or both directories exist or something
}

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
