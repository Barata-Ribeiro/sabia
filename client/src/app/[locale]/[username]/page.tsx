import getUserPublicProfile from "@/actions/user/get-user-public-profile"
import ProfileAvatar from "@/components/profile/profile-avatar"
import ProfileCoverImage from "@/components/profile/profile-cover-image"
import ProfileFollowButton from "@/components/profile/profile-follow-button"
import ProfileTop from "@/components/profile/profile-top"
import LinkButton from "@/components/shared/link-button"
import { UserPublicProfileResponse } from "@/interfaces/user"
import { dateFormat } from "@/utils/date-format"
import { getLocale, getTranslations } from "next-intl/server"
import { notFound } from "next/navigation"
import { HiCalendarDays, HiCheckBadge, HiLink } from "react-icons/hi2"

interface ProfilePageProps {
    params: { username: string }
}

export async function generateMetadata({ params }: ProfilePageProps) {
    const profileState = await getUserPublicProfile(params.username)
    const profile = profileState.response?.data as UserPublicProfileResponse

    return {
        title: `@${profile.username} | Sabiá`,
        description: `${profile.display_name} (@${profile.username})${profile.biography ? ` – ${profile.biography}` : ""}`
    }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
    if (!params.username) return notFound()

    const t = await getTranslations("ProfilePage")
    const localeActive = await getLocale()
    const isEnglishLang = localeActive === "en"

    const profileState = await getUserPublicProfile(params.username)
    const profile = profileState.response?.data as UserPublicProfileResponse

    return (
        <section className="max-w-[37.5rem] flex-1 border-x">
            <header className="w-full p-4">
                <ProfileTop profile={profile} englishLang={isEnglishLang} />
            </header>

            {/* PROFILE */}
            <div>
                <ProfileCoverImage profile={profile} />

                <div className="p-4">
                    <div className="relative flex w-full">
                        <div className="flex flex-1">
                            <ProfileAvatar profile={profile} />
                        </div>

                        <div className="flex flex-col text-right">
                            <ProfileFollowButton userId={profile.id} />
                        </div>
                    </div>

                    <div className="ml-3 mt-3 w-full justify-center space-y-1">
                        <div>
                            <h2 className="flex cursor-default items-center gap-1 text-xl font-semibold leading-6">
                                {profile.display_name}{" "}
                                {profile.is_verified && (
                                    <span
                                        className="text-accent-600"
                                        aria-label={t("VerifiedBadge")}
                                        title={t("VerifiedBadge")}
                                    >
                                        <HiCheckBadge size={22} />
                                    </span>
                                )}
                            </h2>
                            <p className="font-medium leading-5 text-body-500">
                                @{profile.username}
                            </p>
                        </div>

                        <div className="mt-3">
                            {profile.biography && (
                                <p className="mb-2 leading-tight text-white">
                                    {profile.biography}
                                </p>
                            )}
                            <div className="flex items-center text-body-600">
                                {profile.website && (
                                    <span className="mr-2 flex">
                                        <HiLink size={24} />{" "}
                                        <LinkButton
                                            href={profile.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="ml-1 leading-5 text-accent-400"
                                            aria-label={t("WebLink") + profile.website}
                                        >
                                            {profile.website}
                                        </LinkButton>
                                    </span>
                                )}
                                <span className="mr-2 flex items-center">
                                    <HiCalendarDays size={24} />{" "}
                                    <span className="ml-1 leading-5">
                                        {t("JoinedDate")}
                                        {dateFormat(profile.created_at, localeActive)}
                                    </span>
                                </span>
                            </div>
                        </div>

                        <div className="flex w-full items-start justify-start divide-x divide-solid divide-background-600 pt-3">
                            <div className="pr-3 text-center">
                                <span className="font-bold text-secondary-600">
                                    {profile.following_count}
                                </span>
                                <span className="text-body-900">{t("Followings")}</span>
                            </div>
                            <div className="px-3 text-center">
                                <span className="font-bold text-secondary-600">
                                    {profile.followers_count}
                                </span>
                                <span className="text-body-900">{t("Followers")}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <hr className="border-gray-200" />
            </div>
        </section>
    )
}
