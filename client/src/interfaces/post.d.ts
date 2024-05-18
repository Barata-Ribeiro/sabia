import { AuthorResponse } from "@/interfaces/user"

export interface PostResponse {
    id: string
    author: AuthorResponse
    text: string
    hashtags: string[]
    views_count: number
    like_count: number
    repost_count: number
    reply_count: number
    created_at: string
    updated_at: string
}
