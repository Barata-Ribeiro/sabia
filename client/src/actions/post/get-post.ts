"use server"

import { ApiResponse } from "@/interfaces/actions"
import { PostResponse } from "@/interfaces/post"
import { POST_GET_BY_ID } from "@/utils/api-urls"
import ResponseError from "@/utils/response-error"
import verifyAuthentication from "@/utils/verify-authentication"

interface GetPostParams {
    id: string
    locale: string
}

export default async function getPost({ id, locale }: GetPostParams) {
    const isEnglishLang = locale === "en"
    const URL = POST_GET_BY_ID(id)

    try {
        const auth_token = await verifyAuthentication(isEnglishLang)

        const response = await fetch(URL, {
            method: "GET",
            headers: {
                Authorization: "Bearer " + auth_token,
                "Content-Type": "application/json",
                "Content-Language": locale
            },
            next: { revalidate: 60, tags: ["post"] }
        })

        const responseData = (await response.json()) as ApiResponse

        if (!response.ok) throw new Error(responseData.message)

        const data = responseData.data as PostResponse

        return {
            ok: true,
            clientError: null,
            response: { ...responseData, data }
        }
    } catch (error) {
        return ResponseError(error, locale)
    }
}
