import { useCallback, useEffect, useState } from 'react'
import { apiUrl, IS_SNAPSHOT_MODE } from './api'

const REFRESH_INTERVAL_MS = 15000

const normalizeMediaUrl = (value) => {
  if (!value || typeof value !== 'string') {
    return value
  }

  try {
    const parsed = new URL(value, window.location.origin)
    const path = parsed.pathname.replace(/\\/g, '/')
    if (path.startsWith('/tmp/media/')) {
      return `/published-media/${path.slice('/tmp/media/'.length)}${parsed.search}`
    }
    if (path.startsWith('/media/')) {
      return `/published-media/${path.slice('/media/'.length)}${parsed.search}`
    }
    if (path.startsWith('/published-media/')) {
      return `${path}${parsed.search}`
    }
  } catch {
    if (value.includes('/tmp/media/')) {
      return `/published-media/${value.slice(value.indexOf('/tmp/media/') + 11)}`
    }
    if (value.includes('/media/')) {
      return `/published-media/${value.slice(value.indexOf('/media/') + '/media/'.length)}`
    }
  }

  return value
}

export { normalizeMediaUrl }

export const emptyData = {
  profile: {
    name: 'Profile',
    title: '',
    location: '',
    email: '',
    phone: '',
    nationality: '',
    current_focus: '',
    hero_image_url: '',
    cv_url: ''
  },
  summary: '',
  resume_text: '',
  passion_text: '',
  resume: {
    title: '',
    content: ''
  },
  passion: {
    title: '',
    content: ''
  },
  blogs: {
    all: [],
    news: [],
    articles: [],
    insights: []
  },
  contact_blurb: '',
  stats: [],
  story: [],
  experience: [],
  education: [],
  programs: [],
  competencies: [],
  technical: [],
  languages: [],
  interests: [],
  publications: [],
  ideas: [],
  certificates: [],
  media: {
    all: [],
    images: [],
    documents: [],
    home: [],
    story: [],
    work: [],
    research: [],
    library: [],
    general: []
  }
}

export function useProfileContent() {
  const [data, setData] = useState(emptyData)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)
  const [source, setSource] = useState(IS_SNAPSHOT_MODE ? 'snapshot' : 'api')

  const fetchJson = useCallback(async (url, { signal, cache = 'no-store' } = {}) => {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      },
      cache,
      signal
    })

    if (!response.ok) {
      throw new Error(`Content API request failed (${response.status})`)
    }

    const contentType = response.headers.get('content-type') || ''
    if (!contentType.toLowerCase().includes('application/json')) {
      throw new Error(`Expected JSON but received ${contentType || 'unknown content type'}`)
    }

    return response.json()
  }, [])

  const loadContent = useCallback(async ({ signal, silent = false } = {}) => {
    if (!silent) {
      setStatus('loading')
    }
    setError(null)

    let useSnapshot = IS_SNAPSHOT_MODE
    let payload

    if (useSnapshot) {
      payload = await fetchJson('/published-content.json', { signal, cache: 'no-cache' })
    } else {
      try {
        payload = await fetchJson(apiUrl('/api/content'), { signal, cache: 'no-store' })
      } catch (apiError) {
        if (apiError.name === 'AbortError') {
          throw apiError
        }
        payload = await fetchJson('/published-content.json', { signal, cache: 'no-cache' })
        useSnapshot = true
      }
    }

    const normalizePayload = (item) => {
      if (Array.isArray(item)) {
        return item.map(normalizePayload)
      }
      if (item && typeof item === 'object') {
        return Object.fromEntries(Object.entries(item).map(([key, value]) => [key, normalizePayload(value)]))
      }
      if (typeof item === 'string') {
        return normalizeMediaUrl(item)
      }
      return item
    }

    payload = normalizePayload(payload)

    const normalized = {
      ...emptyData,
      ...payload,
      profile: {
        ...emptyData.profile,
        ...(payload.profile || {})
      },
      certificates: payload.certificates || [],
      media: {
        ...emptyData.media,
        ...(payload.media || {})
      }
    }
    setData(normalized)
    setSource(useSnapshot ? 'snapshot' : 'api')
    setStatus('ready')
  }, [fetchJson])

  const handleLoadError = useCallback((loadError) => {
    if (loadError.name === 'AbortError') {
      return
    }
    setStatus('error')
    setError(loadError.message || 'Unable to load live content from backend.')
  }, [])

  const refresh = useCallback(async () => {
    try {
      await loadContent()
    } catch (loadError) {
      handleLoadError(loadError)
    }
  }, [handleLoadError, loadContent])

  useEffect(() => {
    const controller = new AbortController()

    loadContent({ signal: controller.signal }).catch(handleLoadError)

    return () => {
      controller.abort()
    }
  }, [handleLoadError, loadContent])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible') {
        return
      }
      loadContent({ silent: true }).catch(handleLoadError)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [handleLoadError, loadContent])

  useEffect(() => {
    const intervalId = setInterval(() => {
      loadContent({ silent: true }).catch(handleLoadError)
    }, REFRESH_INTERVAL_MS)

    return () => clearInterval(intervalId)
  }, [handleLoadError, loadContent])

  return { data, status, error, refresh, source }
}
