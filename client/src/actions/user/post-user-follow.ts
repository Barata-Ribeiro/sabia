"use server"

import logout from "@/actions/auth/logout"
import { ApiResponse } from "@/interfaces/actions"
import { FOLLOW_USER } from "@/utils/api-urls"
import ResponseError from "@/utils/response-error"
import { getLocale } from "next-intl/server"
import { revalidateTag } from "next/cache"
import { cookies } from "next/headers"

export default async function postUserFollow(userId: string, followId: string) {
    const URL = FOLLOW_USER(userId, followId)
    const locale = await getLocale()
    const isEnglishLang = locale === "en"

    try {
        const auth_token = cookies().get("auth_token")?.value
        if (!auth_token) {
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

        revalidateTag("feed")
        revalidateTag("context")
        revalidateTag("profile")

        return {
            ok: true,
            client_error: null,
            response: responseData
        }
    } catch (error) {
        return ResponseError(error, locale)
    }
}
