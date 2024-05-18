export interface UserContextResponse {
    id: string
    username: string
    display_name: string
    full_name: string
    birth_date: string
    gender: any
    email: string
    avatar_image_url: any
    cover_image_url: any
    biography: any
    website: any
    location: any
    role: string
    is_verified: boolean
    is_private: boolean
    follower_count: number
    following_count: number
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
