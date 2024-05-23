import getUserPublicProfile from "@/actions/user/get-user-public-profile"
import ProfileTop from "@/components/profile/profile-top"
import Button from "@/components/shared/button"
import LinkButton from "@/components/shared/link-button"
import { UserPublicProfileResponse } from "@/interfaces/user"
import { dateFormat } from "@/utils/date-format"
import { getLocale } from "next-intl/server"
import Image from "next/image"
import { HiCalendarDays, HiLink } from "react-icons/hi2"

interface ProfilePageProps {
    params: { username: string }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
    const localeActive = await getLocale()
    const isEnglishLang = localeActive === "en"

    const profileState = await getUserPublicProfile(params.username)
    const profile = profileState.response?.data as UserPublicProfileResponse

    const null_image = "/assets/default/profile-default-svgrepo-com.svg"

    return (
        <section className="max-w-[37.5rem] flex-1 border-x">
            <header className="w-full p-4">
                <ProfileTop profile={profile} englishLang={isEnglishLang} />
            </header>

            {/* PROFILE */}
            <div>
                <div
                    id="profile-image"
                    className="w-full bg-cover bg-center bg-no-repeat"
                    style={{
                        height: "200px",
                        backgroundImage: `url(${profile.cover_image_url})`
                    }}
                >
                    <Image
                        className="h-full w-full opacity-0"
                        style={{ width: "auto", height: "auto" }}
                        src={profile.cover_image_url ?? null_image}
                        alt="Cover Image"
                        width={600}
                        height={200}
                        priority
                    />
                </div>

                <div className="p-4">
                    <div className="relative flex w-full">
                        <div className="flex flex-1">
                            <div style={{ marginTop: "-6rem" }}>
                                <div
                                    style={{ width: "9rem", height: "9rem" }}
                                    className="relative rounded-full"
                                >
                                    <Image
                                        style={{ width: "9rem", height: "9rem" }}
                                        className="relative rounded-full border-4 border-background-900 object-cover"
                                        src={profile.avatar_image_url ?? null_image}
                                        alt="Profile Image"
                                        width={400}
                                        height={400}
                                        priority
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col text-right">
                            <Button className="rounded-full px-4 py-2">
                                Edit Profile
                            </Button>
                        </div>
                    </div>

                    <div className="ml-3 mt-3 w-full justify-center space-y-1">
                        <div>
                            <h2 className="text-xl font-bold leading-6 text-body-900">
                                {profile.display_name}
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
                            <div className="flex text-body-600">
                                {profile.website && (
                                    <span className="mr-2 flex">
                                        <HiLink size={24} />{" "}
                                        <LinkButton
                                            href={profile.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="ml-1 leading-5 text-accent-400"
                                        >
                                            {profile.website}
                                        </LinkButton>
                                    </span>
                                )}
                                <span className="mr-2 flex">
                                    <HiCalendarDays size={24} />{" "}
                                    <span className="ml-1 leading-5">
                                        Joined{" "}
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
                                <span className="text-body-900"> Following</span>
                            </div>
                            <div className="px-3 text-center">
                                <span className="font-bold text-secondary-600">
                                    {profile.followers_count}
                                </span>
                                <span className="text-body-900"> Followers</span>
                            </div>
                        </div>
                    </div>
                </div>
                <hr className="border-gray-200" />
            </div>
        </section>
    )
}
