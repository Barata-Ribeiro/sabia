"use server"

import { ApiResponse } from "@/interfaces/actions"
import { FeedRequestParams, FeedResponse } from "@/interfaces/user"
import { USER_GET_FEED } from "@/utils/api-urls"
import ResponseError from "@/utils/response-error"
import { getLocale } from "next-intl/server"
import { cookies } from "next/headers"

export default async function getUserFeed(
    { page = 0, perPage = 20, userId }: FeedRequestParams = { userId: "" },
    optionsFront?: RequestInit
) {
    const locale = await getLocale()
    const isEnglishLang = locale === "en"
    const URL = USER_GET_FEED({ perPage, page, userId })

    try {
        const auth_token = cookies().get("auth_token")?.value
        if (!auth_token)
            throw new Error(isEnglishLang ? "Unauthorized." : "Não Autorizado.")

        const options = optionsFront || {
            next: { revalidate: 10, tags: ["feed"] }
        }

        const response = await fetch(URL, {
            method: "GET",
            headers: {
                Authorization: "Bearer " + auth_token,
                "Content-Type": "application/json",
                "Content-Language": locale
            },
            ...options
        })

        const responseData = (await response.json()) as ApiResponse

        if (!response.ok) throw new Error(responseData.message)

        const data = responseData.data as FeedResponse

        return {
            ok: true,
            client_error: null,
            response: { ...responseData, data }
        }
    } catch (error) {
        return ResponseError(error, locale)
    }
}
