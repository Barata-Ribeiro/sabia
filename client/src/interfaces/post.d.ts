import { AuthorResponse } from "@/interfaces/user"

export interface PostResponse {
    id: string
    author: AuthorResponse
    text: string
    hashtags: string[]
    views_count: number
    like_count: number
    is_liked: boolean
    repost_off?: PostResponse
    repost_count: number
    reply_count: number
    in_reply_to?: PostResponse
    created_at: string
    updated_at: string
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
    total_pages: number
    total_items: number
    current_page: number
}

export interface PostSearchResponse {
    posts: PostResponse[]
    total_pages: number
    total_items: number
    current_page: number
}
