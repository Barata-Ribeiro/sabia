"use client"

import getIsPostLiked from "@/actions/post/get-is-post-liked"
import postTogglePostLike from "@/actions/post/post-toggle-post-like"
import { useUser } from "@/context/user-context-provider"
import { PostResponse } from "@/interfaces/post"
import tw from "@/utils/tw"
import { useEffect, useState } from "react"
import { HiHeart } from "react-icons/hi2"
import { twMerge } from "tailwind-merge"

export default function PostLikeButton({ post }: { post: PostResponse }) {
    const [isLiked, setIsLiked] = useState(false)
    const [checkingIsLiked, setCheckingIsLiked] = useState(true)
    const [loading, setLoading] = useState(false)
    const { user } = useUser()
    const isOwnerPost = user?.id === post.author.id

    const buttonBaseStyles = tw`cursor-pointer text-background-900 hover:text-background-800 active:text-background-700 disabled:cursor-default
                                       disabled:text-background-300 disabled:opacity-50 disabled:shadow-none disabled:hover:text-background-900 disabled:active:text-background-900`
    const setLikedStyle = isLiked ? "text-red-500" : "text-background-900"
    const setLikedStyleLoading =
        loading || checkingIsLiked ? tw`animate-pulse text-background-300` : ""
    const buttonStyles = twMerge(buttonBaseStyles, setLikedStyle, setLikedStyleLoading)

    async function handleLike() {
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

    useEffect(() => {
        async function checkIsLiked() {
            setCheckingIsLiked(true)

            const isLikedState = await getIsPostLiked(post.id)
            const isLikedResponse = isLikedState.response?.data as { liked: string }
            setIsLiked(isLikedResponse.liked === "true")

            setCheckingIsLiked(false)
        }

        checkIsLiked().catch(console.error)
    }, [post.id])

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
                onClick={handleLike}
                disabled={isOwnerPost || loading || checkingIsLiked}
                aria-disabled={isOwnerPost || loading || checkingIsLiked}
            >
                <HiHeart size={24} />
            </button>
            <p>{post.like_count}</p>
        </div>
    )
}
