"use server"

import { ApiResponse } from "@/interfaces/actions"
import { UserContextResponse } from "@/interfaces/user"
import { USER_GET_CONTEXT } from "@/utils/api-urls"
import ResponseError from "@/utils/response-error"
import { getLocale } from "next-intl/server"
import { cookies } from "next/headers"

export default async function getUserContext() {
    const locale = await getLocale()
    const URL = USER_GET_CONTEXT()
    const isEnglishLang = locale === "en"

    try {
        const auth_token = cookies().get("auth_token")?.value
        if (!auth_token)
            throw new Error(isEnglishLang ? "Unauthorized." : "Não Autorizado.")

        const response = await fetch(URL, {
            method: "GET",
            headers: {
                Authorization: "Bearer " + auth_token,
                "Content-Type": "application/json",
                "Content-Language": locale
            },
            next: { tags: ["context", "profile"] }
        })

        const responseData = (await response.json()) as ApiResponse

        if (!response.ok) throw new Error(responseData.message)

        const data = responseData.data as UserContextResponse

        return {
            ok: true,
            client_error: null,
            response: { ...responseData, data }
        }
    } catch (error) {
        return ResponseError(error, locale)
    }
}
