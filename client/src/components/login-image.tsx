"use client"

import { UnsplashResponse } from "@/interfaces/unplash"
import decodeBlurHash from "@/utils/decode-blur_hash"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { useEffect, useState } from "react"

export default function LoginImage({ photo }: { photo: UnsplashResponse }) {
    const [photoBlur, setPhotoBlur] = useState<string | null>(null)
    const t = useTranslations("LoginPage")

    useEffect(() => {
        setPhotoBlur(decodeBlurHash(photo.blur_hash))
    }, [photo.blur_hash])

    return (
        photoBlur && (
            <Image
                src={photo.urls.raw}
                alt={
                    t("PageImageDescription") +
                    " - " +
                    (photo.description ?? photo.alt_description) +
                    " - " +
                    photo.user.name
                }
                title={
                    t("PageImageDescription") +
                    " - " +
                    (photo.description ?? photo.alt_description) +
                    " - " +
                    photo.user.name
                }
                className="object-cover lg:rounded-bl-2xl"
                sizes="(min-width: 808px) 50vw, 100vw"
                placeholder="blur"
                blurDataURL={photoBlur}
                fill
                priority
            />
        )
    )
}
