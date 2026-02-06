/**
 * Forum and community type definitions
 */

export interface ForumPost {
  id: number
  title: string
  author: string
  authorInitials: string
  time: string
  category: string
  excerpt: string
  replies: number
  likes: number
  views: number
  content?: string
  status?: 'published' | 'draft' | 'archived'
}

export interface ForumCategory {
  id: string
  name: string
  icon: any
  count: number
}

export interface ActiveUser {
  name: string
  initials: string
  status: 'online' | 'away' | 'offline'
  lastSeen: string
}

export interface ForumStats {
  totalMembers: number
  activeToday: number
  totalPosts: number
  totalReplies: number
}
