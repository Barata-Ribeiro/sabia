"use server"

import { ApiResponse, State } from "@/interfaces/actions"
import { PUT_UPDATE_USER_PROFILE } from "@/utils/api-urls"
import ResponseError from "@/utils/response-error"
import verifyAuthentication from "@/utils/verify-authentication"
import { getLocale } from "next-intl/server"
import { revalidateTag } from "next/cache"

export default async function putUpdateUserProfile(state: State, formData: FormData) {
    const locale = await getLocale()
    const isEnglishLang = locale === "en"
    const auth_token = await verifyAuthentication(isEnglishLang)

    try {
        const userId = formData.get("userId") as string
        const URL = PUT_UPDATE_USER_PROFILE(userId)

        const currentPassword = formData.get("currentPassword") as string
        const newPassword = formData.get("newPassword") as string | null
        const confirmPassword = formData.get("confirmPassword") as string | null

        if (newPassword !== confirmPassword) {
            const message = isEnglishLang ? "Passwords do not match." : "Senhas não conferem."
            return ResponseError(new Error(message), locale)
        }

        if (newPassword === currentPassword) {
            const message = isEnglishLang
                ? "New password must be different from the current one;"
                : "A nova senha deve ser diferente da atual;"
            return ResponseError(new Error(message), locale)
        }

        const response = await fetch(URL, {
            method: "PUT",
            headers: {
                Authorization: "Bearer " + auth_token,
                "Content-Type": "application/json",
                "Content-Language": locale
            },
            body: formData
        })

        const responseData = (await response.json()) as ApiResponse

        if (!response.ok) return ResponseError(new Error(responseData.message), locale)

        const data = responseData.data

        revalidateTag("feed")
        revalidateTag("context")
        revalidateTag("profile")

        return {
            ok: true,
            clientError: null,
            response: { ...responseData, data }
        }
    } catch (error: unknown) {
        return ResponseError(error, locale)
    }
}
