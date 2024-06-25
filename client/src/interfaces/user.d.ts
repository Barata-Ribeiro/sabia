import { PostResponse } from "@/interfaces/post"

export interface UserContextResponse {
    id: string
    username: string
    displayName: string
    fullName: string
    birthDate: string
    gender: string
    email: string
    avatarImageUrl: string
    coverImageUrl: string
    biography: string
    website: string
    location: string
    role: string
    isVerified: boolean
    isPrivate: boolean
    followerCount: number
    followingCount: number
    createdAt: string
    updatedAt: string
}

export interface UserPublicProfileResponse {
    id: string
    username: string
    displayName: string
    role: string
    avatarImageUrl: string
    coverImageUrl: string
    biography: string
    website: string
    location: string
    isVerified: boolean
    isPrivate: boolean
    isFollowing: boolean
    followersCount: number
    followingsCount: number
    postsCount: number
    likesCount: number
    createdAt: string
    updatedAt: string
}

export interface AuthorResponse {
    id: string
    username: string
    displayName: string
    avatarImageUrl: string
    isVerified: boolean
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
    totalPages: number
    totalItems: number
    currentPage: number
}

export interface FeedResponse {
    feed: PostResponse[]
    totalPages: number
    totalItems: number
    currentPage: number
}

export interface UserSearchParams {
    perPage: number
    page?: number
    query?: string
}

export interface UserSearchResponse {
    users: UserPublicProfileResponse[]
    totalPages: number
    totalItems: number
    currentPage: number
}
