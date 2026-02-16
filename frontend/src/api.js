const runtimeHost = typeof window !== 'undefined' ? window.location.hostname : ''
const isLocalRuntime = runtimeHost === 'localhost' || runtimeHost === '127.0.0.1'
const envBase = (import.meta.env.VITE_API_BASE_URL || '').trim()
const defaultBase = isLocalRuntime ? 'http://127.0.0.1:8000' : ''
const rawBase = envBase || defaultBase
const API_BASE = rawBase.endsWith('/') ? rawBase.slice(0, -1) : rawBase
const hasApiBase = API_BASE.length > 0
const isSnapshotMode = !hasApiBase && !isLocalRuntime

export const HAS_API_BASE = hasApiBase
export const IS_SNAPSHOT_MODE = isSnapshotMode

export function apiUrl(path) {
  if (!path.startsWith('/')) {
    return API_BASE ? `${API_BASE}/${path}` : `/${path}`
  }
  return API_BASE ? `${API_BASE}${path}` : path
}
