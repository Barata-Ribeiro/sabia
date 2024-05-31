import getUserFollowers from "@/actions/user/get-user-followers"
import ProfileFollowButton from "@/components/profile/profile-follow-button"
import LinkButton from "@/components/shared/link-button"
import { FollowersResponse } from "@/interfaces/user"
import { NULL_AVATAR } from "@/utils/constants"
import getBase64 from "@/utils/get-base64"
import { getLocale } from "next-intl/server"
import Image from "next/image"
import { HiArrowUturnLeft, HiCheckBadge } from "react-icons/hi2"
import { twMerge } from "tailwind-merge"

interface FollowersPageProps {
    params: { username: string }
}

export default async function FollowersPage({ params }: FollowersPageProps) {
    const localeActive = await getLocale()
    const englishLang = localeActive === "en"
    const followersState = await getUserFollowers(params.username)
    const followers = followersState.response?.data as FollowersResponse

    const listOfBlurredDataUrl = followers?.followers.map(async (follower) => {
        if (!follower.avatar_image_url) return null
        return {
            followerId: follower.id,
            blurredDataUrl: await getBase64(follower.avatar_image_url, localeActive)
        }
    })
    const resolvedListOfBlurredDataUrl = await Promise.all(listOfBlurredDataUrl)

    return (
        <section className="w-max max-w-[37.5rem] flex-1 overflow-y-scroll border-x">
            <header className="w-full border-b p-4">
                <div className="flex w-max items-center gap-6">
                    <LinkButton
                        href={"/" + params.username}
                        className="cursor-pointer rounded-full p-2 hover:bg-background-100"
                        aria-label="Go back"
                    >
                        <HiArrowUturnLeft size={24} />
                    </LinkButton>
                    <h2 className="flex cursor-default items-center gap-2 font-heading text-xl font-semibold">
                        {followers.total_items.toLocaleString(
                            englishLang ? "en-US" : "pt-BR"
                        )}{" "}
                        {followers.total_items === 1 ? "Follower" : "Followers"}
                    </h2>
                </div>
            </header>

            <div className="divide-y">
                {followers?.followers.map((follower) => (
                    <div key={follower.id} className="p-4">
                        <div className="flex items-center justify-between">
                            <LinkButton
                                href={"/" + follower.username}
                                className="flex w-fit cursor-pointer items-center gap-4"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Image
                                    src={follower.avatar_image_url ?? NULL_AVATAR}
                                    alt={follower.username}
                                    className="h-12 w-12 rounded-full object-cover"
                                    placeholder={
                                        follower.avatar_image_url ? "blur" : "empty"
                                    }
                                    blurDataURL={
                                        resolvedListOfBlurredDataUrl.find(
                                            (data) => data?.followerId === follower.id
                                        )?.blurredDataUrl
                                    }
                                    width={48}
                                    height={48}
                                />
                                <div className="w-max">
                                    <h3
                                        className={twMerge(
                                            "font-heading font-bold text-body-900",
                                            follower.is_verified &&
                                                "flex items-center gap-1"
                                        )}
                                    >
                                        {follower.display_name}{" "}
                                        {follower.is_verified && (
                                            <span
                                                className="text-accent-600"
                                                title="Verified"
                                                aria-label="Verified"
                                            >
                                                <HiCheckBadge size={22} />
                                            </span>
                                        )}
                                    </h3>
                                    <p className="font-body text-sm text-body-500">
                                        @{follower.username}
                                    </p>
                                </div>
                            </LinkButton>
                            <div className="w-fit">
                                <ProfileFollowButton userId={follower.id} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
