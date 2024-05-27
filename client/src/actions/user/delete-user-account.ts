"use server"

import logout from "@/actions/auth/logout"
import { ApiResponse, State } from "@/interfaces/actions"
import { USER_DELETE_ACCOUNT } from "@/utils/api-urls"
import ResponseError from "@/utils/response-error"
import { getLocale } from "next-intl/server"
import { revalidateTag } from "next/cache"
import { cookies } from "next/headers"

export default async function deleteUserAccount(state: State, formData: FormData) {
    const locale = await getLocale()
    const isEnglishLang = locale === "en"

    const userId = formData.get("userId") as string | null
    const username = formData.get("username") as string | null
    const usernameFromInput = formData.get("usernameDelete") as string | null

    try {
        const auth_token = cookies().get("auth_token")?.value
        if (!auth_token) {
            await logout()
            throw new Error(isEnglishLang ? "Unauthorized." : "Não autorizado.")
        }

        if (!userId)
            throw new Error(isEnglishLang ? "Unauthorized." : "Não autorizado.")

        const URL = USER_DELETE_ACCOUNT(userId)

        if (!username || !usernameFromInput)
            throw new Error(isEnglishLang ? "Unauthorized." : "Não autorizado.")

        if (username !== usernameFromInput.split("-DELETE")[0]) {
            throw new Error(
                isEnglishLang
                    ? "The username you entered does not match the username of the account you are trying to delete."
                    : "O nome de usuário que você digitou não corresponde ao nome de usuário da conta que você está tentando excluir."
            )
        }

        if (!usernameFromInput.endsWith("-DELETE")) {
            throw new Error(
                isEnglishLang
                    ? "To delete your account, type your username followed by the word '-DELETE'."
                    : "Para excluir sua conta, digite seu nome de usuário seguido da palavra '-DELETE'."
            )
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

        if (!response.ok) throw new Error(responseData.message)

        cookies().delete("auth_token")

        revalidateTag("feed")
        revalidateTag("context")
        revalidateTag("profile")

        return {
            ok: true,
            client_error: null,
            response: responseData
        }
    } catch (error) {
        return ResponseError(error, locale)
    }
}
