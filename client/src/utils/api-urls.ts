import { PostHashtagParams, PostSearchParams } from "@/interfaces/post"
import { FeedRequestParams, UserFollowersParams } from "@/interfaces/user"

const BACKEND_URL = process.env.BACKEND_ORIGIN || "http://localhost:8080"

// Auth
export const AUTH_REGISTER = () => `${BACKEND_URL}/api/v1/auth/register`
export const AUTH_LOGIN = () => `${BACKEND_URL}/api/v1/auth/login`
export const AUTH_FORGOTPASSWORD = () => `${BACKEND_URL}/api/v1/auth/forgot-password`
export const AUTH_RESETPASSWORD = (userId: string, token: string) =>
    `${BACKEND_URL}/api/v1/auth/reset-password/${userId}/${token}`

// User
export const USER_GET_CONTEXT = () => `${BACKEND_URL}/api/v1/users/me`
export const USER_GET_FEED = (params: FeedRequestParams) => {
    const { perPage, page, userId } = params
    return `${BACKEND_URL}/api/v1/users/me/${userId}/feed?perPage=${perPage}&page=${page}`
}
export const USER_GET_PUBLIC_PROFILE = (username: string) =>
    `${BACKEND_URL}/api/v1/users/public/${username}`
export const USER_GET_PUBLIC_FEED = (params: FeedRequestParams) => {
    const { perPage, page, userId } = params
    return `${BACKEND_URL}/api/v1/users/public/${userId}/feed?perPage=${perPage}&page=${page}`
}
export const USER_GET_FOLLOWERS = (params: UserFollowersParams) => {
    const { username, perPage, page } = params
    return `${BACKEND_URL}/api/v1/users/public/${username}/followers?perPage=${perPage}&page=${page}`
}
export const IS_USER_FOLLOWING = (userId: string, followId: string) =>
    `${BACKEND_URL}/api/v1/users/me/${userId}/follows/${followId}`
export const FOLLOW_USER = (userId: string, followId: string) =>
    `${BACKEND_URL}/api/v1/users/me/${userId}/follow/${followId}`
export const UNFOLLOW_USER = (userId: string, followId: string) =>
    `${BACKEND_URL}/api/v1/users/me/${userId}/follow/${followId}`
export const USER_DELETE_ACCOUNT = (userId: string) =>
    `${BACKEND_URL}/api/v1/users/me/${userId}`

// Post
export const POST_NEW_POST = () => `${BACKEND_URL}/api/v1/posts/me/new-post`
export const POST_GET_BY_ID = (postId: string) =>
    `${BACKEND_URL}/api/v1/posts/public/${postId}`
export const POST_GET_IS_LIKED = (postId: string) =>
    `${BACKEND_URL}/api/v1/posts/me/${postId}/is-liked`
export const POST_GET_ALL_BY_HASHTAG = (params: PostHashtagParams) => {
    const { hashtag, page, perPage } = params
    return `${BACKEND_URL}/api/v1/posts/public/hashtag/${hashtag}?page=${page}&perPage=${perPage}`
}
export const POST_SEARCH = (params: PostSearchParams) => {
    const { perPage, page, query } = params
    return `${BACKEND_URL}/api/v1/posts/search?q=${query}&page=${page}&perPage=${perPage}`
}
export const POST_REPOST = (postId: string) =>
    `${BACKEND_URL}/api/v1/posts/me/${postId}/repost`
export const POST_TOGGLE_LIKE = (postId: string) =>
    `${BACKEND_URL}/api/v1/posts/me/${postId}/toggle-like`
