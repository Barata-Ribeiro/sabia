"use server"

import { ApiResponse } from "@/interfaces/actions"
import { FollowersResponse } from "@/interfaces/user"
import { USER_GET_FOLLOWERS } from "@/utils/api-urls"
import ResponseError from "@/utils/response-error"
import verifyAuthentication from "@/utils/verify-authentication"
import { getLocale } from "next-intl/server"

export default async function getUserFollowers(username: string, page = 0) {
    const locale = await getLocale()
    const isEnglishLang = locale === "en"
    const URL = USER_GET_FOLLOWERS({ username, perPage: 10, page })
    const auth_token = await verifyAuthentication(isEnglishLang)

    try {
        const response = await fetch(URL, {
            method: "GET",
            headers: {
                Authorization: "Bearer " + auth_token,
                "Content-Type": "application/json",
                "Content-Language": locale
            },
            next: { revalidate: 10, tags: ["context", "profile", "followers"] }
        })

        const responseData = (await response.json()) as ApiResponse

        if (!response.ok) return ResponseError(new Error(responseData.message), locale)

        const data = responseData.data as FollowersResponse

        return { ok: true, clientError: null, response: { ...responseData, data } }
    } catch (error) {
        return ResponseError(error, locale)
    }
}
