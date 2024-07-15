"use server"

import { ApiResponse, State } from "@/interfaces/actions"
import { PostResponse } from "@/interfaces/post"
import { POST_NEW_POST } from "@/utils/api-urls"
import ResponseError from "@/utils/response-error"
import verifyAuthentication from "@/utils/verify-authentication"
import { getLocale } from "next-intl/server"
import { revalidateTag } from "next/cache"

export default async function postNewPost(state: State, formData: FormData) {
    const locale = await getLocale()
    const isEnglishLang = locale === "en"
    const URL = POST_NEW_POST()

    const text = formData.get("newPost") as string | null

    const auth_token = await verifyAuthentication(isEnglishLang)

    try {
        if (!text || text.trim().length === 0) {
            const message = isEnglishLang ? "Text is required." : "Texto é obrigatório."
            return ResponseError(new Error(message), locale)
        }

        if (text.trim().length > 280) {
            const message = isEnglishLang
                ? "Text must have at most 280 characters."
                : "Texto deve ter no máximo 280 caracteres."
            return ResponseError(new Error(message), locale)
        }

        const response = await fetch(URL, {
            method: "POST",
            headers: {
                Authorization: "Bearer " + auth_token,
                "Content-Type": "application/json",
                "Content-Language": locale
            },
            body: JSON.stringify({ text })
        })

        const responseData = (await response.json()) as ApiResponse

        if (!response.ok) return ResponseError(new Error(responseData.message), locale)

        const data = responseData.data as PostResponse

        revalidateTag("feed")

        return { ok: true, clientError: null, response: { ...responseData, data } }
    } catch (error) {
        return ResponseError(error, locale)
    }
}
