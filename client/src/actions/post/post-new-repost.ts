"use server"

import logout from "@/actions/auth/logout"
import { ApiResponse } from "@/interfaces/actions"
import { PostResponse } from "@/interfaces/post"
import { POST_REPOST } from "@/utils/api-urls"
import ResponseError from "@/utils/response-error"
import verifyToken from "@/utils/validate-token"
import { getLocale } from "next-intl/server"
import { revalidateTag } from "next/cache"
import { cookies } from "next/headers"

export default async function postNewRepost(postId: string) {
    const locale = await getLocale()
    const isEnglishLang = locale === "en"
    const URL = POST_REPOST(postId)

    try {
        const auth_token = cookies().get("auth_token")?.value
        if (!auth_token) {
            await logout()
            throw new Error(isEnglishLang ? "Unauthorized." : "Não autorizado.")
        }

        const isTokenValid = verifyToken(auth_token)
        if (!isTokenValid) {
            await logout()
            throw new Error(isEnglishLang ? "Unauthorized." : "Não autorizado.")
        }

        const response = await fetch(URL, {
            method: "POST",
            headers: {
                Authorization: "Bearer " + auth_token,
                "Content-Type": "application/json",
                "Content-Language": locale
            },
            body: JSON.stringify({})
        })

        const responseData = (await response.json()) as ApiResponse

        if (!response.ok) throw new Error(responseData.message)

        const data = responseData.data as PostResponse

        revalidateTag("feed")

        return { ok: true, client_error: null, response: { ...responseData, data } }
    } catch (error) {
        return ResponseError(error, locale)
    }
}