export interface Story {
  id: string
  username: string
  avatar: string
  media: StoryMedia[]
  timestamp: Date
  isViewed?: boolean
}

export interface StoryMedia {
  id: string
  type: string
  media: string
  duration?: number
  timestamp: Date
}

export interface StoryUser {
  id: string
  name: string
  title: string
  stories: StoryMedia[]
  profilePicture: string
  hasUnviewedStories?: boolean
}
export interface Slide {
  url: string
}

export interface StoryArticle {
  articleId: string
  title: string
  authorName: string
  sharableUrl: string
  carousel: {
    slides: Slide[]
  }
}
