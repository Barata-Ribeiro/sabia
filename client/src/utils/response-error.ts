import { State } from "@/interfaces/actions"

const DEFAULT_MESSAGE_EN = "An error occurred. Please try again."
const DEFAULT_MESSAGE_BR = "Ocorreu um erro. Por favor, tente novamente."

export default function ResponseError(error: unknown, locale: string): State {
    console.error(error)

    const state: State = {
        ok: false,
        client_error: null,
        response: null
    }

    return {
        ...state,
        client_error:
            error instanceof Error
                ? error.message
                : locale === "en"
                  ? DEFAULT_MESSAGE_EN
                  : DEFAULT_MESSAGE_BR
    }
}
