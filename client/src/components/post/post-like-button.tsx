"use client"

import postTogglePostLike from "@/actions/post/post-toggle-post-like"
import { useUser } from "@/context/user-context-provider"
import { PostResponse } from "@/interfaces/post"
import tw from "@/utils/tw"
import { MouseEvent, useState } from "react"
import { HiHeart } from "react-icons/hi2"
import { twMerge } from "tailwind-merge"

interface PostLikeButtonProps {
    post: PostResponse
    displayNumber?: boolean
}

export default function PostLikeButton({
    post,
    displayNumber = true
}: PostLikeButtonProps) {
    const [isLiked, setIsLiked] = useState(post.is_liked)
    const [loading, setLoading] = useState(false)

    const { user } = useUser()
    const isOwnerPost = user?.id === post.author.id

    async function handleLike(
        event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
    ) {
        event.stopPropagation()
        if (loading) return

        setLoading(true)
        try {
            const likeState = await postTogglePostLike(post.id)
            const likeResponse = likeState.response?.message as string

            if (!likeState.ok) alert(likeState.client_error)

            if (likeResponse.includes("liked") || likeResponse.includes("curtido")) {
                setIsLiked(true)
            } else setIsLiked(false)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const buttonBaseStyles = tw`cursor-pointer text-background-900 hover:text-background-800 active:text-background-700 disabled:cursor-default
                                       disabled:text-background-300 disabled:opacity-50 disabled:shadow-none disabled:hover:text-background-900 disabled:active:text-background-900`
    let setLikedStyle = isLiked ? "text-red-500" : "text-background-900"
    const setLikedStyleLoading = loading ? tw`animate-pulse text-background-300` : ""
    const buttonStyles = twMerge(buttonBaseStyles, setLikedStyleLoading, setLikedStyle)

    return (
        <div
            id="post-like"
            className="flex w-max cursor-default items-center gap-2"
            title="Like"
            aria-label="Like"
        >
            <button
                type="button"
                className={buttonStyles}
                onClick={(event) => handleLike(event)}
                disabled={isOwnerPost || loading}
                aria-disabled={isOwnerPost || loading}
            >
                <HiHeart size={24} />
            </button>
            {displayNumber && <p aria-label="Like Count">{post.like_count}</p>}
        </div>
    )
}
