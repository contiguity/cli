import type yargsTypes from 'yargsTypes'

export function storeKey(key: string) {
  // TODO: make this work via a config file
  localStorage.setItem('contiguity-cli-key', key)
}
export function clearStoredKey() {
  localStorage.removeItem('contiguity-cli-key')
}

export function getKey(givenKey?: string, noStored?: boolean) {
  if (givenKey) return givenKey
  if (!noStored) {
    const storedKey = localStorage.getItem('contiguity-cli-key')
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