"use server"

import { ApiResponse, State } from "@/interfaces/actions"
import { USER_DELETE_ACCOUNT } from "@/utils/api-urls"
import ResponseError from "@/utils/response-error"
import verifyAuthentication from "@/utils/verify-authentication"
import { getLocale } from "next-intl/server"
import { revalidateTag } from "next/cache"
import { cookies } from "next/headers"

export default async function deleteUserAccount(state: State, formData: FormData) {
    const locale = await getLocale()
    const isEnglishLang = locale === "en"

    const userId = formData.get("userId") as string | null
    const username = formData.get("username") as string | null
    const usernameFromInput = formData.get("usernameDelete") as string | null

    const auth_token = await verifyAuthentication(isEnglishLang)

    try {
        if (!userId) return ResponseError(new Error(isEnglishLang ? "Unauthorized." : "Não autorizado."), locale)

        const URL = USER_DELETE_ACCOUNT(userId)

        if (!username || !usernameFromInput)
            return ResponseError(new Error(isEnglishLang ? "Unauthorized." : "Não autorizado."), locale)

        if (username !== usernameFromInput.split("-DELETE")[0]) {
            const message = isEnglishLang
                ? "The username you entered does not match the username of the account you are trying to delete."
                : "O nome de usuário que você digitou não corresponde ao nome de usuário da conta que você está tentando excluir."
            return ResponseError(new Error(message), locale)
        }

        if (!usernameFromInput.endsWith("-DELETE")) {
            const message = isEnglishLang
                ? "To delete your account, type your username followed by the word '-DELETE'."
                : "Para excluir sua conta, digite seu nome de usuário seguido da palavra '-DELETE'."
            return ResponseError(new Error(message), locale)
        }

        const response = await fetch(URL, {
            method: "DELETE",
            headers: {
                Authorization: "Bearer " + auth_token,
                "Content-Type": "application/json",
                "Content-Language": locale
            }
        })

        const responseData = (await response.json()) as ApiResponse

        if (!response.ok) return ResponseError(new Error(responseData.message), locale)

        cookies().delete("auth_token")

        revalidateTag("feed")
        revalidateTag("context")
        revalidateTag("profile")

        return {
            ok: true,
            clientError: null,
            response: responseData
        }
    } catch (error) {
        return ResponseError(error, locale)
    }
}
