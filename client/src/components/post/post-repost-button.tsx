"use client"

import postNewRepost from "@/actions/post/post-new-repost"
import { PostResponse } from "@/interfaces/post"
import { useRouter } from "@/navigation"
import tw from "@/utils/tw"
import { useState } from "react"
import { HiMiniArrowPath } from "react-icons/hi2"
import { twMerge } from "tailwind-merge"

interface PostRepostButtonProps {
    post: PostResponse
    displayNumber?: boolean
}

export default function PostRepostButton({
    post,
    displayNumber = true
}: PostRepostButtonProps) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const buttonBaseStyles = tw`cursor-pointer text-background-900 hover:text-background-800 active:text-background-700 disabled:cursor-default
                                       disabled:text-background-300 disabled:opacity-50 disabled:shadow-none disabled:hover:text-background-900 disabled:active:text-background-900`

    const setRepostedStyleLoading = loading ? tw`animate-pulse text-background-300` : ""

    const buttonStyles = twMerge(buttonBaseStyles, setRepostedStyleLoading)

    async function handleRepost() {
        if (loading) return

        setLoading(true)
        try {
            const repostState = await postNewRepost(post.id)
            const repostResponse = repostState.response?.data as PostResponse

            if (!repostState.ok) alert(repostState.client_error)
            else
                router.push(
                    "/" +
                        repostResponse.author.username +
                        "/status/" +
                        repostResponse.id
                )
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div
            id="post-repost"
            className="flex w-max items-center gap-2"
            title="Repost"
            aria-label="Repost"
        >
            <button
                type="button"
                className={buttonStyles}
                onClick={handleRepost}
                disabled={loading}
                aria-disabled={loading}
            >
                <HiMiniArrowPath size={24} />
            </button>
            {displayNumber && <p aria-label="Repost Count">{post.repost_count}</p>}
        </div>
    )
}
