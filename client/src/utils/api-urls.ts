const BACKEND_URL = process.env.BACKEND_ORIGIN || "http://localhost:8080"

// Auth
export const AUTH_REGISTER = () => `${BACKEND_URL}/api/v1/auth/register`
export const AUTH_LOGIN = () => `${BACKEND_URL}/api/v1/auth/login`
export const AUTH_FORGOTPASSWORD = () => `${BACKEND_URL}/api/v1/auth/forgot-password`
export const AUTH_RESETPASSWORD = (userId: string, token: string) =>
    `${BACKEND_URL}/api/v1/auth/reset-password/${userId}/${token}`

// User
export const USER_GET_CONTEXT = () => `${BACKEND_URL}/api/v1/users/me`

// Post

export const POST_NEW_POST = () => `${BACKEND_URL}/api/v1/posts/me/new-post`
