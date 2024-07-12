import getUserFollowers from "@/actions/user/get-user-followers"
import ProfileEntity from "@/components/profile/profile-entity"
import LinkButton from "@/components/shared/link-button"
import { FollowersResponse } from "@/interfaces/user"
import { redirect } from "@/navigation"
import getBase64 from "@/utils/get-base64"
import { Metadata } from "next"
import { getLocale } from "next-intl/server"
import { notFound } from "next/navigation"
import { HiArrowUturnLeft } from "react-icons/hi2"

interface FollowersPageProps {
    params: { username: string }
    searchParams?: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: FollowersPageProps): Promise<Metadata> {
    return {
        title: "Followers of @" + params.username,
        description: `Followers of @${params.username}`
    }
}

export default async function FollowersPage({ params, searchParams }: Readonly<FollowersPageProps>) {
    if (!params.username) return notFound()
    if (!searchParams) return notFound()

    let page = 0
    if (!searchParams.page) return redirect("/" + params.username + "/followers?page=0")
    else page = parseInt(searchParams.page as string)

    const localeActive = await getLocale()
    const englishLang = localeActive === "en"

    const followersState = await getUserFollowers(params.username, page)
    const followersResponse = followersState.response?.data as FollowersResponse

    const listOfBlurredDataUrl = followersResponse?.followers.map(async (follower) => {
        if (!follower.avatarImageUrl) return null
        return {
            userId: follower.id,
            blurredDataUrl: await getBase64(follower.avatarImageUrl, localeActive)
        }
    })

    const resolvedListOfBlurredDataUrl = await Promise.all(listOfBlurredDataUrl)

    return (
        <section className="w-full flex-1 overflow-y-scroll border-x md:max-w-[38rem]">
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
                        {followersResponse.totalItems.toLocaleString(englishLang ? "en-US" : "pt-BR")}{" "}
                        {followersResponse.totalItems === 1 ? "Follower" : "Followers"}
                    </h2>
                </div>
            </header>

            <div className="divide-y">
                {followersResponse?.followers.map((follower) => (
                    <ProfileEntity
                        key={follower.id}
                        user={follower}
                        resolvedListOfBlurredDataUrl={resolvedListOfBlurredDataUrl}
                        totalPages={followersResponse.totalPages}
                        page={page}
                    />
                ))}
            </div>
        </section>
    )
}
