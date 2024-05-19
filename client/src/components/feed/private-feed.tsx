"use client"

import getUserFeed from "@/actions/user/get-user-feed"
import { FeedResponse } from "@/interfaces/user"
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
            <ul className="flex flex-col gap-4">
                {posts.map((post) => (
                    <li key={post.id} className="flex flex-col gap-2">
                        <div className="flex gap-2">
                            <Image
                                src={post.author.avatar_image_url}
                                alt={post.author.username}
                                className="h-10 w-10 rounded-full"
                                width={40}
                                height={40}
                                quality={50}
                            />
                            <div className="flex flex-col gap-1">
                                <span className="font-body text-body-300">
                                    {post.author.display_name}
                                </span>
                                <span className="font-body text-body-400">
                                    @{post.author.username}
                                </span>
                            </div>
                        </div>
                        <p className="font-body text-body-300">{post.text}</p>
                    </li>
                ))}
            </ul>
            <div className="mx-auto my-1 flex h-24">
                {infinite ? (
                    loading && <p>Loading...</p>
                ) : (
                    <p className="text-center font-body text-body-300">
                        You have reached the end of the feed.
                    </p>
                )}
            </div>
        </>
    )
}
