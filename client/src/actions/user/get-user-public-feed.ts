"use server"

import { ApiResponse } from "@/interfaces/actions"
import { FeedRequestParams, FeedResponse } from "@/interfaces/user"
import { USER_GET_PUBLIC_FEED } from "@/utils/api-urls"
import ResponseError from "@/utils/response-error"
import { getLocale } from "next-intl/server"

export default async function getUserPublicFeed(
    { page = 0, perPage = 20, userId }: FeedRequestParams = { userId: "" },
    optionsFront?: RequestInit
) {
    const locale = await getLocale()
    const URL = USER_GET_PUBLIC_FEED({ perPage, page, userId })

    try {
        const options = optionsFront || {
            next: { revalidate: 10, tags: ["feed"] }
        }

        const response = await fetch(URL, {
            method: "GET",
            headers: {
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