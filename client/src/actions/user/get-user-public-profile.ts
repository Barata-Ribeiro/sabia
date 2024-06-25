"use server"

import { ApiResponse } from "@/interfaces/actions"
import { UserPublicProfileResponse } from "@/interfaces/user"
import { USER_GET_PUBLIC_PROFILE } from "@/utils/api-urls"
import ResponseError from "@/utils/response-error"
import verifyAuthentication from "@/utils/verify-authentication"
import { getLocale } from "next-intl/server"

export default async function getUserPublicProfile(username: string) {
    const locale = await getLocale()
    const isEnglishLang = locale === "en"
    const URL = USER_GET_PUBLIC_PROFILE(username)

    try {
        const auth_token = await verifyAuthentication(isEnglishLang)

        const response = await fetch(URL, {
            method: "GET",
            headers: {
                Authorization: "Bearer " + auth_token,
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
            clientError: null,
            response: { ...responseData, data }
        }
    } catch (error) {
        return ResponseError(error, locale)
    }
}
