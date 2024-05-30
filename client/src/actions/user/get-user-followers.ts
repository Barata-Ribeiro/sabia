"use server"

import { ApiResponse } from "@/interfaces/actions"
import { FollowersResponse } from "@/interfaces/user"
import { USER_GET_FOLLOWERS } from "@/utils/api-urls"
import ResponseError from "@/utils/response-error"
import { getLocale } from "next-intl/server"

export default async function getUserFollowers(username: string) {
    const locale = await getLocale()
    const URL = USER_GET_FOLLOWERS({ username, perPage: 10, page: 1 })

    try {
        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Content-Language": locale
            },
            next: { tags: ["context", "profile", "followers"] }
        })

        const responseData = (await response.json()) as ApiResponse

        if (!response.ok) throw new Error(responseData.message)

        const data = responseData.data as FollowersResponse

        return { ok: true, client_error: null, response: { ...responseData, data } }
    } catch (error) {
        return ResponseError(error, locale)
    }
}
