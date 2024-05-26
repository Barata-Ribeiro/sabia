import { getPlaiceholder } from "plaiceholder"

export default async function getBase64(imageUrl: string, locale: string) {
    const isEnglishLang = locale === "en"
    const errorText = isEnglishLang ? "Failed to fetch image" : "Falha ao buscar imagem"

    try {
        const response = await fetch(imageUrl)

        if (!response.ok) {
            throw new Error(errorText + `: ${response.status} ${response.statusText}`)
        }

        const buffer = await response.arrayBuffer()

        const { base64 } = await getPlaiceholder(Buffer.from(buffer))

        return base64
    } catch (error) {
        if (error instanceof Error) console.error(error.stack)
    }
}
