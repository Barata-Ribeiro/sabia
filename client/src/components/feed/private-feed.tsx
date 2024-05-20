"use client"

import getUserFeed from "@/actions/user/get-user-feed"
import LinkButton from "@/components/shared/link-button"
import { FeedResponse } from "@/interfaces/user"
import { dateToHowLongAgo } from "@/utils/date-format"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

interface PrivateFeedProps {
    feedResponse: FeedResponse
    userId: string
}

export default function PrivateFeed({ feedResponse, userId }: PrivateFeedProps) {
    const [feed, setFeed] = useState<FeedResponse>(feedResponse)
    const [posts, setPosts] = useState(feed.feed ?? [])
    const [page, setPage] = useState(feedResponse.current_page)
    const [loading, setLoading] = useState(false)
    const [infinite, setInfinite] = useState(posts.length >= 20)

    const fetching = useRef(false)
    const t = useTranslations("PrivateFeed")

    const null_image = "/assets/default/profile-default-svgrepo-com.svg"

    function infiniteScroll() {
        if (fetching.current) return

        fetching.current = true

        setLoading(true)

        setTimeout(() => {
            setPage((currentPage) => currentPage + 1)
            fetching.current = false
            setLoading(false)
        }, 1000)
    }

    useEffect(() => {
        if (page === 0) return

        async function fetchPrivateFeed(page: number) {
            const feedState = await getUserFeed({ perPage: 6, page, userId })
            const feed = feedState.response?.data as FeedResponse
            const posts = feed?.feed ?? []

            if (feedState && feed && posts) {
                setFeed(feed)
                setPosts((prevPhotos) => [...prevPhotos, ...posts])
                if (posts.length < 20) setInfinite(false)
            }
        }

        fetchPrivateFeed(page)
    }, [page, userId])

    useEffect(() => {
        if (infinite) {
            window.addEventListener("scroll", infiniteScroll)
            window.addEventListener("wheel", infiniteScroll)
        } else {
            window.removeEventListener("scroll", infiniteScroll)
            window.removeEventListener("wheel", infiniteScroll)
        }
        return () => {
            window.removeEventListener("scroll", infiniteScroll)
            window.removeEventListener("wheel", infiniteScroll)
        }
    }, [infinite])

    return (
        <>
            <ul
                className="flex flex-col divide-y"
                role="list"
                aria-label={t("AriaLabelList")}
            >
                {posts.map((post) => (
                    <li
                        key={post.id}
                        onClick={() =>
                            window.location.assign(
                                post.author.username + "/status/" + post.id
                            )
                        }
                        className="flex w-full cursor-pointer flex-col gap-2 overflow-hidden p-4 hover:bg-background-100"
                    >
                        <div className="flex w-full items-start gap-5">
                            <Image
                                src={post.author.avatar_image_url ?? null_image}
                                alt={post.author.username}
                                className="aspect-square h-10 w-10 rounded-full object-cover"
                                width={128}
                                height={128}
                                quality={50}
                            />
                            <article className="flex flex-col gap-1">
                                <div className="flex w-max gap-1">
                                    <p className="font-heading font-bold text-body-900">
                                        {post.author.display_name}
                                    </p>
                                    <p className="font-body text-body-500">
                                        @{post.author.username}
                                    </p>
                                    <span className="text-body-300">·</span>
                                    <LinkButton
                                        href={
                                            post.author.username + "/status/" + post.id
                                        }
                                        className="text-body-500 hover:underline"
                                    >
                                        <time dateTime={post.created_at}>
                                            {dateToHowLongAgo(post.created_at)}
                                        </time>
                                    </LinkButton>
                                </div>
                                <p className="text-pretty text-body-900">{post.text}</p>
                            </article>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="mx-auto mt-auto flex h-max w-max pt-4">
                {infinite ? (
                    loading && <p>Loading...</p>
                ) : (
                    <p className="text-body-300">{t("EndOfFeed")}</p>
                )}
            </div>
        </>
    )
}
