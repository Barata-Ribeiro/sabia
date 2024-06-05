"use server"

import { ApiResponse } from "@/interfaces/actions"
import { PostHashtagParams, PostsHashtagResponse } from "@/interfaces/post"
import { POST_GET_ALL_BY_HASHTAG } from "@/utils/api-urls"
import ResponseError from "@/utils/response-error"
import verifyAuthentication from "@/utils/verify-authentication"
import { getLocale } from "next-intl/server"

export default async function getPostsByHashtag({
    hashtag,
    page = 0,
    perPage = 10
}: PostHashtagParams) {
    const locale = await getLocale()
    const isEnglishLang = locale === "en"
    const URL = POST_GET_ALL_BY_HASHTAG({ hashtag, page, perPage })

    try {
        const auth_token = await verifyAuthentication(isEnglishLang)

        const response = await fetch(URL, {
            method: "GET",
            headers: {
                Authorization: "Bearer " + auth_token,
                "Content-Type": "application/json",
                "Content-Language": locale
            },
            next: { revalidate: 10 }
        })

        const responseData = (await response.json()) as ApiResponse

        if (!response.ok) throw new Error(responseData.message)

        const data = responseData.data as PostsHashtagResponse

        return {
            ok: true,
            client_error: null,
            response: { ...responseData, data }
        }
    } catch (error) {
        return ResponseError(error, locale)
    }
}
