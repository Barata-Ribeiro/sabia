"use server"

import { ApiResponse, State } from "@/interfaces/actions"
import { AuthLoginResponse } from "@/interfaces/auth"
import { AUTH_LOGIN } from "@/utils/api-urls"
import ResponseError from "@/utils/response-error"
import { getLocale } from "next-intl/server"
import { revalidateTag } from "next/cache"
import { cookies } from "next/headers"

export default async function login(state: State, formData: FormData) {
    const URL = AUTH_LOGIN()
    const ONE_DAY = 24 * 60 * 60 * 1000
    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000

    const locale = await getLocale()

    const username = formData.get("username") as string | null
    const password = formData.get("password") as string | null
    const rememberMe = formData.get("rememberMe") === "on"

    try {
        if (!username || !password) {
            const errorMessage =
                locale === "en" ? "Username and password are required." : "Usuário e senha são obrigatórios."
            return ResponseError(new Error(errorMessage), locale)
        }

        const response = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Content-Language": locale
            },
            body: JSON.stringify({
                username,
                password,
                rememberMe
            })
        })

        const responseData = (await response.json()) as ApiResponse

        if (!response.ok) return ResponseError(new Error(responseData.message), locale)

        const loginResponse = responseData.data as AuthLoginResponse

        cookies().set("auth_token", loginResponse.token, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            expires: Date.now() + (rememberMe ? THIRTY_DAYS : ONE_DAY)
        })

        revalidateTag("context")

        return {
            ok: true,
            clientError: null,
            response: { ...responseData, loginResponse }
        }
    } catch (error) {
        return ResponseError(error, locale)
    }
}
