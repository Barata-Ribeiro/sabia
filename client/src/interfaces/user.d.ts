import { PostResponse } from "@/interfaces/post"

export interface UserContextResponse {
    id: string
    username: string
    display_name: string
    full_name: string
    birth_date: string
    gender: string
    email: string
    avatar_image_url: string
    cover_image_url: string
    biography: string
    website: string
    location: string
    role: string
    is_verified: boolean
    is_private: boolean
    follower_count: number
    following_count: number
    created_at: string
    updated_at: string
}

export interface UserPublicProfileResponse {
    id: string
    username: string
    display_name: string
    role: string
    avatar_image_url: string
    cover_image_url: string
    biography: string
    website: string
    location: string
    is_verified: boolean
    is_private: boolean
    is_following: boolean
    followers_count: number
    following_count: number
    posts_count: number
    likes_count: number
    created_at: string
    updated_at: string
}

export interface AuthorResponse {
    id: string
    username: string
    display_name: string
    avatar_image_url: string
    is_verified: boolean
    role: string
}

export interface FeedRequestParams {
    perPage?: number
    page?: number
    userId: string
}

export interface UserFollowersParams {
    perPage?: number
    page?: number
    username: string
}

export interface FollowersResponse {
    followers: UserPublicProfileResponse[]
    total_pages: number
    total_items: number
    current_page: number
}

export interface FeedResponse {
    feed: PostResponse[]
    total_pages: number
    total_items: number
    current_page: number
}

export interface UserSearchParams {
    perPage: number
    page?: number
    query?: string
}

export interface UserSearchResponse {
    users: UserPublicProfileResponse[]
    total_pages: number
    total_items: number
    current_page: number
}
