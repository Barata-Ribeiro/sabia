export interface AuthLoginResponse {
    id: string
    username: string
    expirationDate: string
    token: string
}

export interface AuthRegisterResponse {
    id: string
    username: string
    displayName: string
}
