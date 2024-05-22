import { AuthorResponse } from "@/interfaces/user"

export interface PostResponse {
    id: string
    author: AuthorResponse
    text: string
    hashtags: string[]
    views_count: number
    like_count: number
    repost_off?: PostResponse
    repost_count: number
    reply_count: number
    in_reply_to?: PostResponse
    created_at: string
    updated_at: string
}

export interface PostSearchParams {
    perPage: number
    page: number
    query: string
}
