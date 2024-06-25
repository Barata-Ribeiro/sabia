"use client"

import getTrendingHashtags from "@/actions/post/get-trending-hashtags"
import getUserRecommendations from "@/actions/user/get-user-recommendations"
import LinkButton from "@/components/shared/link-button"
import { TrendingHashtagsResponse } from "@/interfaces/post"
import { UserPublicProfileResponse } from "@/interfaces/user"
import { NULL_AVATAR } from "@/utils/constants"
import Image from "next/image"
import { useEffect, useState } from "react"
import { HiCheckBadge } from "react-icons/hi2"
import { twMerge } from "tailwind-merge"

export default function TrendingMenu() {
    const [hashtags, setHashtags] = useState<TrendingHashtagsResponse | null>(null)
    const [recommendations, setRecommendations] = useState<
        UserPublicProfileResponse[] | null
    >(null)
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        Promise.all([getTrendingHashtags(), getUserRecommendations()])
            .then(([hashtagsState, recommendationsState]) => {
                const hashtagResponse = hashtagsState.response
                    ?.data as TrendingHashtagsResponse
                setHashtags(hashtagResponse)

                const recommendationResponse = recommendationsState.response?.data as {
                    recommendations: UserPublicProfileResponse[]
                }
                setRecommendations(recommendationResponse.recommendations)
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false))
    }, [])

    if (loading)
        return (
            <aside
                id="hashtag-trending-loading"
                className="hidden h-full w-full max-w-[20rem] animate-pulse flex-col gap-4 bg-clip-border p-4 text-gray-700 lg:flex"
            >
                {[1, 2].map((index) => (
                    <div key={index} className="w-full rounded-lg border bg-white">
                        <div className="h-12 rounded-t bg-gray-200 px-4 pt-2"></div>
                        <ul className="flex flex-col">
                            {[1, 2, 3, 4, 5].map((index) => (
                                <li key={index}>
                                    <div className="flex flex-col px-4 py-2">
                                        <div className="mb-2 h-6 w-1/2 rounded bg-gray-200 font-bold"></div>
                                        <div className="h-4 w-1/3 rounded bg-gray-200 text-sm"></div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </aside>
        )

    return (
        <aside
            id="hashtag-trending"
            className="hidden h-full w-full max-w-[20rem] flex-col gap-4 bg-clip-border p-4 text-gray-700 md:flex"
        >
            <div className="w-full rounded-lg border bg-white">
                <h2 className="px-4 pt-2 font-heading text-2xl font-bold text-body-900">
                    Trending
                </h2>
                {hashtags && hashtags.trendingHashtags.length > 0 ? (
                    <ul className="flex flex-col">
                        {hashtags?.trendingHashtags.map((entity, index) => (
                            <li
                                key={entity.hashtag + "_" + index}
                                id={entity.hashtag + "_" + index}
                            >
                                <LinkButton
                                    href={"/hashtag/" + entity.hashtag + "?page=0"}
                                    className="flex flex-col px-4 py-2 text-body-700 hover:bg-background-100 hover:text-body-900"
                                >
                                    <p className="font-bold hover:underline">
                                        #{entity.hashtag}
                                    </p>
                                    <span className="text-sm">
                                        {entity.totalPosts} posts
                                    </span>
                                </LinkButton>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="p-4 text-body-700">No trending hashtags</p>
                )}
            </div>
            <div className="w-full rounded-lg border bg-white">
                <h2 className="px-4 pt-2 font-heading text-2xl font-bold text-body-900">
                    Recommended
                </h2>
                {recommendations && recommendations.length > 0 ? (
                    <ul className="flex flex-col">
                        {recommendations.map((entity, index) => (
                            <li key={entity.username + "_" + index}>
                                <LinkButton
                                    href={"/" + entity.username}
                                    className="flex items-center gap-2 px-4 py-2 text-body-700 hover:bg-background-100 hover:text-body-900"
                                >
                                    <Image
                                        src={entity.avatarImageUrl ?? NULL_AVATAR}
                                        alt={entity.username}
                                        className="aspect-square h-10 w-10 rounded-full object-cover"
                                        width={128}
                                        height={128}
                                        quality={50}
                                    />
                                    <div className="flex flex-col gap-1">
                                        <p
                                            className={twMerge(
                                                "font-heading font-bold text-body-900",
                                                entity.isVerified &&
                                                    "flex items-center gap-1"
                                            )}
                                        >
                                            {entity.displayName}{" "}
                                            {entity.isVerified && (
                                                <span
                                                    className="text-accent-600"
                                                    title="Verified"
                                                >
                                                    <HiCheckBadge size={22} />
                                                </span>
                                            )}
                                        </p>
                                        <span className="text-sm">
                                            @{entity.username}
                                        </span>
                                    </div>
                                </LinkButton>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="p-4 text-body-700">No recommendations</p>
                )}
            </div>
        </aside>
    )
}
