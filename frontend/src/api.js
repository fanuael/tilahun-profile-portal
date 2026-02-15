const rawBase = import.meta.env.VITE_API_BASE_URL || ''
const API_BASE = rawBase.endsWith('/') ? rawBase.slice(0, -1) : rawBase

export function apiUrl(path) {
  if (!path.startsWith('/')) {
    return API_BASE ? `${API_BASE}/${path}` : `/${path}`
  }
  return API_BASE ? `${API_BASE}${path}` : path
}
