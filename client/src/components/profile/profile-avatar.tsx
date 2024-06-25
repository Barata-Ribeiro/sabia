import LinkButton from "@/components/shared/link-button"
import { UserPublicProfileResponse } from "@/interfaces/user"
import { NULL_AVATAR } from "@/utils/constants"
import getBase64 from "@/utils/get-base64"
import { getLocale, getTranslations } from "next-intl/server"
import Image from "next/image"

export default async function ProfileAvatar({
    profile
}: Readonly<{
    profile: UserPublicProfileResponse
}>) {
    const t = await getTranslations("Profile.Avatar")
    const localeActive = await getLocale()

    const avatarBlur = await getBase64(profile.avatarImageUrl, localeActive)

    return (
        <div style={{ marginTop: "-6rem" }}>
            <div
                style={{ width: "9rem", height: "9rem" }}
                className="relative antialiased"
            >
                <Image
                    className="pointer-events-none absolute rounded-full border-4 border-background-600 bg-background-600 object-cover object-center italic"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    src={profile.avatarImageUrl ?? NULL_AVATAR}
                    placeholder={profile.avatarImageUrl ? "blur" : "empty"}
                    blurDataURL={avatarBlur}
                    alt={t("AltAvatar")}
                    priority
                    fill
                />
                {profile.avatarImageUrl && (
                    <LinkButton
                        href={profile.avatarImageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={t("AriaLabelLink")}
                    >
                        <div
                            aria-hidden="true"
                            className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden rounded-full bg-[hsl(0,0%,0%,0.2)] bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100"
                        ></div>
                    </LinkButton>
                )}
            </div>
        </div>
    )
}
