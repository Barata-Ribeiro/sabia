import { State } from "@/interfaces/actions"

const DEFAULT_MESSAGE_EN = "An error occurred. Please try again."
const DEFAULT_MESSAGE_BR = "Ocorreu um erro. Por favor, tente novamente."

export default function ResponseError(error: unknown, locale: string): State {
    console.error(error)

    const state: State = {
        ok: false,
        clientError: null,
        response: null
    }

    const defaultMessage = locale === "en" ? DEFAULT_MESSAGE_EN : DEFAULT_MESSAGE_BR

    return {
        ...state,
        clientError: error instanceof Error ? error.message : defaultMessage
    }
}
