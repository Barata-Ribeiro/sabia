"use server"

import { UnsplashResponse } from "@/interfaces/unplash"

export default async function getUnsplashRandomImage(query: string) {
    const URL = `https://api.unsplash.com/photos/random?query=${query}`

    try {
        const photoResponse = await fetch(URL, {
            method: "GET",
            headers: { Authorization: "Client-ID " + process.env.UNSPLASH_ACCESS_KEY }
        })

        const photo = (await photoResponse.json()) as UnsplashResponse

        if (!photoResponse.ok) {
            throw new Error("Failed to fetch image " + photoResponse.statusText + " - " + photoResponse.status)
        }

        return { photo }
    } catch (error) {
        console.error(error)
        return { photo: null }
    }
}
