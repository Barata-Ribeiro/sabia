"use server"

import { ApiResponse } from "@/interfaces/actions"
import { UserPublicProfileResponse } from "@/interfaces/user"
import { USER_GET_PUBLIC_PROFILE } from "@/utils/api-urls"
import ResponseError from "@/utils/response-error"
import { getLocale } from "next-intl/server"

export default async function getUserPublicProfile(username: string) {
    const locale = await getLocale()
    const URL = USER_GET_PUBLIC_PROFILE(username)

    try {
        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Content-Language": locale
            },
            next: { revalidate: 60, tags: ["profile"] }
        })

        const responseData = (await response.json()) as ApiResponse

        if (!response.ok) throw new Error(responseData.message)

        const data = responseData.data as UserPublicProfileResponse

        return {
            ok: true,
            client_error: null,
            response: { ...responseData, data }
        }
    } catch (error) {
        return ResponseError(error, locale)
    }
}
