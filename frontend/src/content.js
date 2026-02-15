import { useEffect, useState } from 'react'
import { apiUrl, hasBackendApi } from './api'

const SNAPSHOT_PATH = '/published-content.json'

export const emptyData = {
  profile: {
    name: 'Tilahun Alene Terfie',
    title: 'Innovation and Sustainable Business Professional',
    location: 'Addis Ababa, Ethiopia',
    email: 'tilahunalenee@gmail.com',
    phone: '+251 941 883 746',
    nationality: 'Ethiopian',
    current_focus: 'MBA in Sustainable International Business and Foreign Trade',
    hero_image_url: '',
    cv_url: ''
  },
  summary: '',
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

  useEffect(() => {
    let isMounted = true

    const loadFromApi = async () => {
      const response = await fetch(apiUrl('/api/content'))
      if (!response.ok) {
        throw new Error('Failed to load API content')
      }
      return response.json()
    }

    const loadFromSnapshot = async () => {
      const response = await fetch(SNAPSHOT_PATH)
      if (!response.ok) {
        throw new Error('Failed to load snapshot content')
      }
      return response.json()
    }

    const loadContent = async () => {
      if (hasBackendApi) {
        try {
          const payload = await loadFromApi()
          if (isMounted) {
            setData(payload)
            setStatus('ready')
          }
          return
        } catch (error) {
          // Fall back to snapshot when backend is private/offline in production.
        }
      }

      try {
        const payload = await loadFromSnapshot()
        if (isMounted) {
          setData(payload)
          setStatus('snapshot')
        }
      } catch (error) {
        if (isMounted) {
          setStatus('error')
        }
      }
    }

    loadContent()

    return () => {
      isMounted = false
    }
  }, [])

  return { data, status }
}
