"use client"

import PostLikeButton from "@/components/post/post-like-button"
import PostReplyButton from "@/components/post/post-reply-button"
import PostRepostButton from "@/components/post/post-repost-button"
import LinkButton from "@/components/shared/link-button"
import { PostResponse } from "@/interfaces/post"
import { useRouter } from "@/navigation"
import { NULL_AVATAR } from "@/utils/constants"
import { dateToHowLongAgo } from "@/utils/date-format"
import formatTextWithHashtags from "@/utils/format-text-with-hashtags"
import { useLocale } from "next-intl"
import Image from "next/image"
import type { MouseEvent } from "react"
import { HiCheckBadge } from "react-icons/hi2"
import { twMerge } from "tailwind-merge"

export default function FeedPost({ post }: { post: PostResponse }) {
    const localeActive = useLocale()
    const router = useRouter()

    function handlePostClick(
        username: string,
        postId: string,
        event: MouseEvent<HTMLLIElement, globalThis.MouseEvent>
    ) {
        if (event.isPropagationStopped()) return
        if (event.target instanceof HTMLAnchorElement) return
        router.push("/" + username + "/status/" + postId)
    }

    return (
        <li
            id={post.author.username + "-" + post.id}
            onClick={(e) => handlePostClick(post.author.username, post.id, e)}
            className="flex w-full cursor-pointer flex-col gap-2 overflow-hidden p-4 hover:bg-background-100"
        >
            <div className="flex w-full flex-col items-start gap-2 md:flex-row md:gap-5">
                <Image
                    src={post.author.avatar_image_url ?? NULL_AVATAR}
                    alt={post.author.username}
                    className="aspect-square h-10 w-10 rounded-full object-cover"
                    width={128}
                    height={128}
                    quality={50}
                />
                <article className="flex flex-col gap-1">
                    <header className="flex w-max flex-col gap-1 md:flex-row">
                        <p
                            className={twMerge(
                                "font-heading font-bold text-body-900",
                                post.author.is_verified && "flex items-center gap-1"
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
                        <div className="flex gap-1">
                            <p className="font-body text-body-500">
                                @{post.author.username}
                            </p>
                            <span className="text-body-300">·</span>
                            <LinkButton
                                href={"/" + post.author.username + "/status/" + post.id}
                                className="text-body-500 hover:underline"
                            >
                                <time dateTime={post.created_at}>
                                    {dateToHowLongAgo(post.created_at, localeActive)}
                                </time>
                            </LinkButton>
                        </div>
                    </header>

                    <p className="text-pretty text-body-900">
                        {post.hashtags.length > 0
                            ? formatTextWithHashtags(post.text, post.hashtags)
                            : post.text}
                    </p>

                    <footer className="mt-2 flex items-center justify-between">
                        <PostReplyButton post={post} displayNumber={false} />
                        <PostRepostButton post={post} displayNumber={false} />
                        <PostLikeButton post={post} displayNumber={false} />
                    </footer>
                </article>
            </div>
        </li>
    )
}
