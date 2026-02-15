import { useEffect, useState } from 'react'
import { apiUrl } from './api'

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
    fetch(apiUrl('/api/content'))
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to load content')
        }
        return res.json()
      })
      .then((payload) => {
        if (isMounted) {
          setData(payload)
          setStatus('ready')
        }
      })
      .catch(() => {
        if (isMounted) {
          setStatus('error')
        }
      })
    return () => {
      isMounted = false
    }
  }, [])

  return { data, status }
}
