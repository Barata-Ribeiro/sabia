"use client"

import getUserFeed from "@/actions/user/get-user-feed"
import LinkButton from "@/components/shared/link-button"
import { PostResponse } from "@/interfaces/post"
import { FeedResponse } from "@/interfaces/user"
import { useRouter } from "@/navigation"
import { dateToHowLongAgo } from "@/utils/date-format"
import formatTextWithHashtags from "@/utils/format-text-with-hashtags"
import { useLocale, useTranslations } from "next-intl"
import Image from "next/image"
import { type MouseEvent, useCallback, useEffect, useRef, useState } from "react"
import { HiCheckBadge } from "react-icons/hi2"
import { useInView } from "react-intersection-observer"
import { twMerge } from "tailwind-merge"

interface PrivateFeedProps {
    feedResponse: FeedResponse
    userId: string
}

export default function PrivateFeed({ feedResponse, userId }: PrivateFeedProps) {
    const [feed, setFeed] = useState(feedResponse)
    const [feedPosts, setFeedPosts] = useState<PostResponse[]>(feed.feed)
    const [page, setPage] = useState(feed.current_page)
    const [loading, setLoading] = useState(false)
    const [infinite, setInfinite] = useState(feedPosts.length >= 20)
    const { ref, inView } = useInView({ threshold: 1 })

    const null_image = "/assets/default/profile-default-svgrepo-com.svg"
    const fetching = useRef(false)
    const t = useTranslations("PrivateFeed")
    const localeActive = useLocale()
    const router = useRouter()

    const infiniteScroll = useCallback(async () => {
        if (fetching.current || !infinite || loading) return
        fetching.current = true
        setLoading(true)

        try {
            const newPage = page + 1
            setPage(newPage)
            const feedState = await getUserFeed(
                { perPage: 5, page: newPage, userId },
                { cache: "no-store" }
            )
            const feedResponse = feedState.response?.data as FeedResponse
            setFeed(feedResponse)

            if (feedResponse && feedResponse.feed != null) {
                const newPosts = feedResponse.feed as PostResponse[]
                setFeedPosts((prevPosts) => {
                    const postsMap = new Map(prevPosts.map((post) => [post.id, post]))
                    newPosts.forEach((post) => {
                        if (!postsMap.has(post.id)) postsMap.set(post.id, post)
                    })
                    return Array.from(postsMap.values())
                })
                if (newPosts.length < 5) setInfinite(false)
            }
        } catch (error) {
            console.error(error)
            setInfinite(false)
        } finally {
            setLoading(false)
            fetching.current = false
        }
    }, [infinite, loading, page, userId])

    function handlePostClick(
        username: string,
        postId: string,
        event: MouseEvent<HTMLLIElement, globalThis.MouseEvent>
    ) {
        if (event.target instanceof HTMLAnchorElement) return
        router.push(username + "/status/" + postId)
    }

    useEffect(() => {
        if (inView && !loading && infinite) {
            ;(async () => await infiniteScroll())()
        }
    }, [inView, infinite, infiniteScroll, loading])

    return (
        <>
            <ul
                className="flex flex-col divide-y"
                role="list"
                aria-label={t("AriaLabelList")}
            >
                {feedPosts.map((post) => (
                    <li
                        key={post.author.username + "-" + post.id}
                        id={post.author.username + "-" + post.id}
                        onClick={(e) =>
                            handlePostClick(post.author.username, post.id, e)
                        }
                        className="flex w-full cursor-pointer flex-col gap-2 overflow-hidden p-4 hover:bg-background-100"
                    >
                        <div className="flex w-full flex-col items-start gap-2 md:flex-row md:gap-5">
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
                                    <p
                                        className={twMerge(
                                            "font-heading font-bold text-body-900",
                                            post.author.is_verified &&
                                                "flex items-center gap-1"
                                        )}
                                    >
                                        {post.author.display_name}{" "}
                                        {post.author.is_verified && (
                                            <span
                                                className="text-accent-600"
                                                title="Verified"
                                                aria-label="Verified"
                                            >
                                                <HiCheckBadge size={22} />
                                            </span>
                                        )}
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
                                            {dateToHowLongAgo(
                                                post.created_at,
                                                localeActive
                                            )}
                                        </time>
                                    </LinkButton>
                                </div>

                                <p className="text-pretty text-body-900">
                                    {post.hashtags.length > 0
                                        ? formatTextWithHashtags(
                                              post.text,
                                              post.hashtags
                                          )
                                        : post.text}
                                </p>
                            </article>
                        </div>
                    </li>
                ))}
            </ul>
            <div ref={ref} className="mx-auto mt-auto flex h-max w-max pt-4">
                {infinite ? (
                    loading && <p>Loading...</p>
                ) : (
                    <p className="text-body-300">{t("EndOfFeed")}</p>
                )}
            </div>
        </>
    )
}
