import { UserPublicProfileResponse } from "@/interfaces/user"
import { getTranslations } from "next-intl/server"
import Image from "next/image"

export default async function ProfileCoverImage({
    profile
}: {
    profile: UserPublicProfileResponse
}) {
    const t = await getTranslations("Profile.Cover")

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
                    alt={t("AltCover")}
                    priority
                    fill
                />
            )}
        </div>
    )
}
