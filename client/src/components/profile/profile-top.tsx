import LinkButton from "@/components/shared/link-button"
import { UserPublicProfileResponse } from "@/interfaces/user"
import { getTranslations } from "next-intl/server"
import { HiArrowUturnLeft, HiCheckBadge } from "react-icons/hi2"

export default async function ProfileTop({
    profile,
    englishLang
}: Readonly<{
    profile: UserPublicProfileResponse
    englishLang: boolean
}>) {
    const t = await getTranslations("Profile.Top")

    return (
        <div className="flex w-max items-center gap-6">
            <LinkButton
                href="/"
                className="cursor-pointer rounded-full p-2 hover:bg-background-100"
                aria-label={t("AriaLabelLink")}
            >
                <HiArrowUturnLeft size={24} />
            </LinkButton>
            <div>
                <h2 className="flex cursor-default items-center gap-2 font-heading text-xl font-semibold">
                    {profile.displayName}{" "}
                    {profile.isVerified && (
                        <span className="text-accent-600" title="Verified">
                            <HiCheckBadge size={24} />
                        </span>
                    )}
                </h2>
                <span className="text-base">
                    {profile.postsCount.toLocaleString(englishLang ? "en-US" : "pt-BR")} {t("Title")}
                </span>
            </div>
        </div>
    )
}
