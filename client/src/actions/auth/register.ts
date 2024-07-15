"use server"

import login from "@/actions/auth/login"
import { ApiResponse, State } from "@/interfaces/actions"
import { AUTH_REGISTER } from "@/utils/api-urls"
import ResponseError from "@/utils/response-error"
import { emailValidation, passwordValidation, usernameValidation } from "@/utils/validate-input"
import { getLocale } from "next-intl/server"

function formatBirthDate(newDateFromData: Date) {
    const day = String(newDateFromData.getUTCDate()).padStart(2, "0")
    const month = String(newDateFromData.getUTCMonth() + 1).padStart(2, "0")
    const year = newDateFromData.getUTCFullYear()
    return `${day}/${month}/${year}`
}

export default async function register(state: State, formData: FormData) {
    const URL = AUTH_REGISTER()
    const locale = await getLocale()
    const isEnglish = locale === "en"

    const fields = [
        "username",
        "displayName",
        "firstName",
        "lastName",
        "birthDate",
        "email",
        "password",
        "confirmPassword"
    ]
    const mappedFormData = fields.map((field) => formData.get(field))

    try {
        if (mappedFormData.includes(null)) {
            const message = isEnglish ? "All fields are required." : "Todos os campos são" + " obrigatórios."
            return ResponseError(new Error(message), locale)
        }

        if (!usernameValidation(mappedFormData.at(0) as string)) {
            const message = isEnglish
                ? "Username must be between 4 and 20 characters long and can only contain letters and numbers."
                : "O nome de usuário deve ter entre 4 e 20 caracteres e só pode conter letras e números."
            return ResponseError(new Error(message), locale)
        }

        if (!emailValidation(mappedFormData.at(5) as string)) {
            const message = isEnglish ? "Invalid email address." : "Endereço de e-mail inválido."
            return ResponseError(new Error(message), locale)
        }

        if (!passwordValidation(mappedFormData.at(6) as string)) {
            const message = isEnglish
                ? "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character."
                : "A senha deve ter pelo menos 8 caracteres, conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial."
            return ResponseError(new Error(message), locale)
        }

        if (mappedFormData.at(6) !== mappedFormData.at(7)) {
            const message = isEnglish ? "Passwords do not match." : "As senhas não coincidem."
            return ResponseError(new Error(message), locale)
        }

        const fullName = `${String(mappedFormData.at(2)).trim()} ${String(mappedFormData.at(3)).trim()}`

        const newDateFromData = new Date(String(mappedFormData.at(4)).trim())
        const birthDate = formatBirthDate(newDateFromData)

        const response = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Content-Language": locale
            },
            body: JSON.stringify({
                username: String(mappedFormData.at(0)).trim(),
                displayName: String(mappedFormData.at(1)).trim(),
                fullName,
                birthDate,
                email: String(mappedFormData.at(5)).trim(),
                password: String(mappedFormData.at(6)).trim()
            })
        })

        const responseData = (await response.json()) as ApiResponse

        if (!response.ok) return ResponseError(new Error(responseData.message), locale)

        const loginResponseFormData = new FormData()
        loginResponseFormData.set("username", String(mappedFormData.at(0)).trim())
        loginResponseFormData.set("password", String(mappedFormData.at(6)).trim())
        loginResponseFormData.set("rememberMe", "on")

        await login(state, loginResponseFormData)

        return {
            ok: true,
            clientError: null,
            response: responseData
        }
    } catch (error) {
        console.error(error)
        return ResponseError(error, locale)
    }
}
