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
import { HiCheckBadge, HiMiniArrowPath } from "react-icons/hi2"
import { twMerge } from "tailwind-merge"

export default function FeedRepost({ post }: Readonly<{ post: PostResponse }>) {
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
            className="flex cursor-pointer flex-col gap-2 overflow-hidden p-4 hover:bg-background-100"
        >
            <LinkButton
                href={"/" + post.author.username}
                className="flex cursor-pointer items-center gap-1 text-accent-600 hover:underline"
                aria-label="Author Profile"
            >
                <HiMiniArrowPath size={14} /> {post.author.username} reposted this.
            </LinkButton>
            <div className="flex w-full flex-col items-start gap-2 md:flex-row md:gap-5">
                <Image
                    src={post.repostOff?.author.avatarImageUrl ?? NULL_AVATAR}
                    alt={post.repostOff!.author.username}
                    className="aspect-square h-10 w-10 rounded-full object-cover"
                    width={128}
                    height={128}
                    quality={50}
                />
                <article className="flex w-full flex-col gap-1">
                    <header className="flex w-max flex-col gap-1 md:flex-row">
                        <p
                            className={twMerge(
                                "font-heading font-bold text-body-900",
                                post.repostOff?.author.isVerified && "flex items-center gap-1"
                            )}
                        >
                            {post.repostOff?.author.displayName}{" "}
                            {post.repostOff?.author.isVerified && (
                                <span className="text-accent-600" title="Verified" aria-label="Verified">
                                    <HiCheckBadge size={22} />
                                </span>
                            )}
                        </p>
                        <div className="flex gap-1">
                            <p className="font-body text-body-500">@{post.repostOff?.author.username}</p>
                            <span className="text-body-300">·</span>
                            <LinkButton
                                href={"/" + post.repostOff?.author.username + "/status/" + post.id}
                                className="text-body-500 hover:underline"
                            >
                                <time dateTime={post.repostOff?.createdAt}>
                                    {dateToHowLongAgo(post.repostOff!.createdAt, localeActive)}
                                </time>
                            </LinkButton>
                        </div>
                    </header>

                    <p className="text-pretty text-body-900">
                        {post.repostOff!.hashtags.length > 0
                            ? formatTextWithHashtags(post.repostOff!.text, post.repostOff!.hashtags)
                            : post.repostOff!.text}
                    </p>

                    <footer className="mt-2 flex items-center justify-between">
                        <PostReplyButton post={post.repostOff!} displayNumber={false} />
                        <PostRepostButton post={post.repostOff!} displayNumber={false} />
                        <PostLikeButton post={post.repostOff!} displayNumber={false} />
                    </footer>
                </article>
            </div>
        </li>
    )
}
