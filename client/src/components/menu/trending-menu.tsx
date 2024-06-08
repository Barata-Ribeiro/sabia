"use client"

import getTrendingHashtags from "@/actions/post/get-trending-hashtags"
import LinkButton from "@/components/shared/link-button"
import { TrendingHashtagsResponse } from "@/interfaces/post"
import { useEffect, useState } from "react"

export default function TrendingMenu() {
    const [hashtags, setHashtags] = useState<TrendingHashtagsResponse | null>(null)
    useEffect(() => {
        getTrendingHashtags()
            .then((hashtagsState) => {
                const hashtagResponse = hashtagsState.response
                    ?.data as TrendingHashtagsResponse
                setHashtags(hashtagResponse)
            })
            .catch((error) => console.error(error))
    }, [])

    return (
        <aside
            id="hashtag-trending"
            className="h-full w-full max-w-[20rem] bg-clip-border p-4 text-gray-700"
        >
            <div className="w-full rounded-lg border">
                <h2 className="px-4 pt-2 font-heading text-2xl font-bold text-body-900">
                    Trending
                </h2>
                {hashtags && hashtags.trending_hashtags.length > 0 ? (
                    <ul className="flex flex-col">
                        {hashtags?.trending_hashtags.map((entity, index) => (
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
                                        {entity.total_posts} posts
                                    </span>
                                </LinkButton>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="p-4 text-body-700">No trending hashtags</p>
                )}
            </div>
        </aside>
    )
}
