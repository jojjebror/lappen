type StorageArea = 'localStorage' | 'sessionStorage'

export function readStored<T>(key: string, fallback: T, area: StorageArea = 'localStorage'): T {
  try {
    const raw = window[area].getItem(key)
    return raw == null ? fallback : (JSON.parse(raw) as T)
  } catch {
    return fallback
  }
}

export function writeStored(key: string, value: unknown, area: StorageArea = 'localStorage') {
  try {
    window[area].setItem(key, JSON.stringify(value))
  } catch {
    // Storage can be unavailable (private mode); the value then lasts for this visit only.
  }
}
