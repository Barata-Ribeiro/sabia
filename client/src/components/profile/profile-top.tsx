import LinkButton from "@/components/shared/link-button"
import { UserPublicProfileResponse } from "@/interfaces/user"
import { HiArrowUturnLeft, HiCheckBadge } from "react-icons/hi2"

export default function ProfileTop({
    profile,
    englishLang
}: {
    profile: UserPublicProfileResponse
    englishLang: boolean
}) {
    return (
        <div className="flex w-max items-center gap-6">
            <LinkButton
                href="/"
                className="cursor-pointer rounded-full p-2 hover:bg-background-100"
            >
                <HiArrowUturnLeft size={24} />
            </LinkButton>
            <div>
                <h2 className="flex cursor-default items-center gap-2 font-heading text-xl font-semibold">
                    {profile.display_name}{" "}
                    {profile.is_verified && (
                        <span className="text-accent-600" title="Verified">
                            <HiCheckBadge size={24} />
                        </span>
                    )}
                </h2>
                <span className="text-base">
                    {profile.posts_count.toLocaleString(
                        englishLang ? "en-US" : "pt-BR"
                    )}{" "}
                    Posts
                </span>
            </div>
        </div>
    )
}
