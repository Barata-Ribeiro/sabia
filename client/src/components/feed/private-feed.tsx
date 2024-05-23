"use client"

import getUserFeed from "@/actions/user/get-user-feed"
import FeedPost from "@/components/feed/feed-post"
import Loading from "@/components/shared/loading"
import { PostResponse } from "@/interfaces/post"
import { FeedResponse } from "@/interfaces/user"
import { useTranslations } from "next-intl"
import { useCallback, useEffect, useRef, useState } from "react"
import { useInView } from "react-intersection-observer"

interface PrivateFeedProps {
    feedResponse: FeedResponse
    userId: string
}

export default function PrivateFeed({ feedResponse, userId }: PrivateFeedProps) {
    const t = useTranslations("PrivateFeed")

    const [feed, setFeed] = useState(feedResponse)
    const [feedPosts, setFeedPosts] = useState<PostResponse[]>(feed.feed)
    const [page, setPage] = useState(feed.current_page)
    const [loading, setLoading] = useState(false)
    const [infinite, setInfinite] = useState(feedPosts.length >= 20)
    const { ref, inView } = useInView({ threshold: 1 })
    const fetching = useRef(false)

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
                    <FeedPost key={post.author.username + "-" + post.id} post={post} />
                ))}
            </ul>
            <div ref={ref} className="mx-auto mt-auto flex h-max w-max pt-4">
                {infinite ? (
                    loading && <Loading />
                ) : (
                    <p className="text-body-300">{t("EndOfFeed")}</p>
                )}
            </div>
        </>
    )
}
