import { cookies } from "next/headers"

export default async function verifyAuthentication(isEnglishLang: boolean) {
    const auth_token = cookies().get("auth_token")?.value
    if (!auth_token) throw new Error(isEnglishLang ? "Unauthorized." : "Não autorizado.")
    return auth_token
}
