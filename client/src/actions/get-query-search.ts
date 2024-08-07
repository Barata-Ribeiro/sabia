"use server"

import { ApiResponse } from "@/interfaces/actions"
import { POST_SEARCH, USER_SEARCH } from "@/utils/api-urls"
import ResponseError from "@/utils/response-error"
import verifyAuthentication from "@/utils/verify-authentication"

export default async function getQuerySearch(locale: string, query: string, fetchType: "user" | "post", page = 0) {
    const isEnglishLang = locale === "en"
    const USER_URL = USER_SEARCH({ query, page, perPage: 10 })
    const POST_URL = POST_SEARCH({ query, page, perPage: 10 })
    const URL = fetchType === "user" ? USER_URL : POST_URL
    const auth_token = await verifyAuthentication(isEnglishLang)

    try {
        const response = await fetch(URL, {
            method: "GET",
            headers: {
                Authorization: "Bearer " + auth_token,
                "Content-Type": "application/json",
                "Content-Language": locale
            },
            next: { revalidate: 10, tags: ["search"] }
        })

        const responseData = (await response.json()) as ApiResponse

        if (!response.ok) return ResponseError(new Error(responseData.message), locale)

        const data = responseData.data

        return { ok: true, clientError: null, response: { ...responseData, data } }
    } catch (error) {
        return ResponseError(error, locale)
    }
}
