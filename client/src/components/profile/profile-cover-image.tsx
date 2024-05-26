import { UserPublicProfileResponse } from "@/interfaces/user"
import getBase64 from "@/utils/get-base64"
import { getLocale, getTranslations } from "next-intl/server"
import Image from "next/image"

export default async function ProfileCoverImage({
    profile
}: {
    profile: UserPublicProfileResponse
}) {
    const t = await getTranslations("Profile.Cover")
    const localeActive = await getLocale()

    let coverBlur: string | undefined
    if (profile.cover_image_url) {
        coverBlur = await getBase64(profile.cover_image_url, localeActive)
    }

    return (
        <div
            id="profile-image"
            className="relative h-48 w-full bg-gradient-to-br from-background-100 to-background-200 dark:from-background-900 dark:to-background-800"
        >
            {profile.cover_image_url && (
                <Image
                    className="pointer-events-none absolute object-cover object-center italic"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    src={profile.cover_image_url}
                    placeholder="blur"
                    blurDataURL={coverBlur}
                    alt={t("AltCover")}
                    priority
                    fill
                />
            )}
        </div>
    )
}
