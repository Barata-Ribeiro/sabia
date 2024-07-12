import PostReplyButton from "@/components/post/post-reply-button"
import LinkButton from "@/components/shared/link-button"
import { PostResponse } from "@/interfaces/post"
import { NULL_AVATAR } from "@/utils/constants"
import { dateTimeFormat } from "@/utils/date-format"
import formatTextWithHashtags from "@/utils/format-text-with-hashtags"
import Image from "next/image"
import { HiCheckBadge, HiMiniArrowPath } from "react-icons/hi2"
import { twMerge } from "tailwind-merge"
import PostLikeButton from "./post-like-button"
import PostRepostButton from "./post-repost-button"

export default function Repost(
    props: Readonly<{
        post: PostResponse
        locale: string
    }>
) {
    return (
        <article id="post-article" className="flex flex-col gap-1">
            <LinkButton
                href={"/" + props.post.author.username}
                className="flex cursor-pointer items-center gap-1 text-accent-600 hover:underline"
                aria-label="Author Profile"
            >
                <HiMiniArrowPath size={14} /> {props.post.author.username} reposted this.
            </LinkButton>
            <LinkButton
                href={"/" + props.post.repostOff?.author.username}
                className="cursor-pointer"
                aria-label="Author Profile"
            >
                <header className="mb-4 flex w-max items-center gap-2">
                    <Image
                        src={props.post.repostOff?.author.avatarImageUrl ?? NULL_AVATAR}
                        alt={props.post.repostOff!.author.username}
                        className="aspect-square h-10 w-10 rounded-full object-cover"
                        width={128}
                        height={128}
                        quality={50}
                    />
                    <div>
                        <p
                            className={twMerge(
                                "font-heading font-bold text-body-900",
                                props.post.repostOff?.author.isVerified && "flex items-center gap-1"
                            )}
                        >
                            {props.post.repostOff?.author.displayName}{" "}
                            {props.post.repostOff?.author.isVerified && (
                                <span className="text-accent-600" title="Verified">
                                    <HiCheckBadge size={22} />
                                </span>
                            )}
                        </p>
                        <p className="font-body text-body-500">@{props.post.repostOff?.author.username}</p>
                    </div>
                </header>
            </LinkButton>

            <p className="text-pretty text-body-900">
                {props.post.repostOff!.hashtags.length > 0
                    ? formatTextWithHashtags(props.post.repostOff!.text, props.post.repostOff!.hashtags)
                    : props.post.repostOff?.text}
            </p>

            <footer>
                <div className="flex w-max items-center gap-1">
                    <LinkButton
                        href={"/" + props.post.repostOff?.author.username + "/status/" + props.post.repostOff?.id}
                        className="text-body-500 hover:underline"
                    >
                        <time dateTime={props.post.repostOff?.createdAt}>
                            {dateTimeFormat(props.post.repostOff!.createdAt, props.locale)}
                        </time>
                    </LinkButton>
                    <p className="text-body-500">
                        · <strong>{props.post.repostOff?.viewsCount}</strong> Views
                    </p>
                </div>
                <div className="my-2 flex items-center justify-between border-y py-2">
                    <PostReplyButton post={props.post.repostOff!} />

                    <PostRepostButton post={props.post.repostOff!} />

                    <PostLikeButton post={props.post.repostOff!} />
                </div>
            </footer>
        </article>
    )
}
