"use server"

import { ApiResponse } from "@/interfaces/actions"
import { FeedRequestParams, FeedResponse } from "@/interfaces/user"
import { USER_GET_PUBLIC_FEED } from "@/utils/api-urls"
import ResponseError from "@/utils/response-error"
import verifyAuthentication from "@/utils/verify-authentication"
import { getLocale } from "next-intl/server"

export default async function getUserPublicFeed(
    { page = 0, perPage = 20, userId }: FeedRequestParams = { userId: "" },
    optionsFront?: RequestInit
) {
    const locale = await getLocale()
    const isEnglishLang = locale === "en"
    const URL = USER_GET_PUBLIC_FEED({ perPage, page, userId })
    const auth_token = await verifyAuthentication(isEnglishLang)

    try {
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
            clientError: null,
            response: { ...responseData, data }
        }
    } catch (error) {
        return ResponseError(error, locale)
    }
}
