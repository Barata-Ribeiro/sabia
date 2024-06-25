import { AuthorResponse } from "@/interfaces/user"

export interface PostResponse {
    id: string
    author: AuthorResponse
    text: string
    hashtags: string[]
    viewsCount: number
    likeCount: number
    isLiked: boolean
    repostOff?: PostResponse
    repostCount: number
    replyCount: number
    inReplyTo?: PostResponse
    createdAt: string
    updatedAt: string
}

export interface PostSearchParams {
    perPage: number
    page?: number
    query?: string
}

export interface PostHashtagParams {
    hashtag: string
    page?: number
    perPage?: number
}

export interface PostsHashtagResponse {
    posts: PostResponse[]
    totalPages: number
    totalItems: number
    currentPage: number
}

export interface PostSearchResponse {
    posts: PostResponse[]
    totalPages: number
    totalItems: number
    currentPage: number
}

export interface TrendingHashtagsResponse {
    trendingHashtags: TrendingHashtag[]
    totalItems: number
}

export interface TrendingHashtag {
    totalPosts: number
    createdAt: string
    hashtag: string
}
