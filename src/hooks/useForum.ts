import { useState, useEffect } from 'react'
import { ForumPost, ForumCategory, ActiveUser, ForumStats } from '../types/forum'
import {
  getForumPosts,
  getForumCategories,
  getActiveUsers,
  getForumStats,
  getUserPosts
} from '../services/forum.service'

// ─── Simple in-memory cache ───────────────────────────────────────────────────
const TTL = 5 * 60 * 1000 // 5 minutes

interface CacheEntry<T> {
  data: T
  ts: number
}

const cache: Record<string, CacheEntry<any>> = {}

function getCached<T>(key: string): T | null {
  const entry = cache[key]
  if (!entry) return null
  if (Date.now() - entry.ts > TTL) {
    delete cache[key]
    return null
  }
  return entry.data as T
}

function setCached<T>(key: string, data: T) {
  cache[key] = { data, ts: Date.now() }
}

// ─── Posts ────────────────────────────────────────────────────────────────────
export const useForumPosts = (category?: string, filter?: string) => {
  const cacheKey = `posts:${category ?? ''}:${filter ?? ''}`
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const cached = getCached<ForumPost[]>(cacheKey)
    if (cached) {
      setPosts(cached)
      setLoading(false)
      setError(null)
      return
    }

    let cancelled = false
    setPosts([])
    setLoading(true)
    setError(null)

    getForumPosts(category, filter)
      .then((data) => {
        if (cancelled) return
        setCached(cacheKey, data)
        setPosts(data)
      })
      .catch((err) => {
        if (cancelled) return
        setError('Failed to load forum posts')
        console.error('Forum posts error:', err)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [cacheKey])

  return { posts, loading, error }
}

// ─── Categories ───────────────────────────────────────────────────────────────
export const useForumCategories = () => {
  const [categories, setCategories] = useState<ForumCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const cached = getCached<ForumCategory[]>('categories')
    if (cached) {
      setCategories(cached)
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)

    getForumCategories()
      .then((data) => {
        if (cancelled) return
        setCached('categories', data)
        setCategories(data)
      })
      .catch((err) => {
        if (cancelled) return
        setError('Failed to load categories')
        console.error('Forum categories error:', err)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [])

  return { categories, loading, error }
}

// ─── Active users (non-blocking — loads in background) ───────────────────────
export const useActiveUsers = () => {
  const [users, setUsers] = useState<ActiveUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const cached = getCached<ActiveUser[]>('active_users')
    if (cached) {
      setUsers(cached)
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)

    getActiveUsers()
      .then((data) => {
        if (cancelled) return
        setCached('active_users', data)
        setUsers(data)
      })
      .catch((err) => {
        if (cancelled) return
        setError('Failed to load active users')
        console.error('Active users error:', err)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [])

  return { users, loading, error }
}

// ─── Stats ────────────────────────────────────────────────────────────────────
export const useForumStats = () => {
  const defaultStats: ForumStats = { totalMembers: 0, activeToday: 0, totalPosts: 0, totalReplies: 0 }
  const [stats, setStats] = useState<ForumStats>(defaultStats)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const cached = getCached<ForumStats>('forum_stats')
    if (cached) {
      setStats(cached)
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)

    getForumStats()
      .then((data) => {
        if (cancelled) return
        setCached('forum_stats', data)
        setStats(data)
      })
      .catch((err) => {
        if (cancelled) return
        setError('Failed to load forum stats')
        console.error('Forum stats error:', err)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [])

  return { stats, loading, error }
}

// ─── User's own posts ─────────────────────────────────────────────────────────
export const useUserPosts = () => {
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPosts = () => {
    setLoading(true)
    setError(null)
    getUserPosts()
      .then(setPosts)
      .catch((err) => {
        setError('Failed to load your posts')
        console.error('User posts error:', err)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchPosts() }, [])

  return { posts, loading, error, refetch: fetchPosts }
}
