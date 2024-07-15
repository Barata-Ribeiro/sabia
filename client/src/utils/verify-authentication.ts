import ResponseError from "@/utils/response-error"
import { cookies } from "next/headers"

export default async function verifyAuthentication(isEnglishLang: boolean) {
    const auth_token = cookies().get("auth_token")?.value
    if (!auth_token)
        return ResponseError(isEnglishLang ? "Unauthorized." : "Não autorizado.", isEnglishLang ? "en" : "pt-BR")
    return auth_token
}
