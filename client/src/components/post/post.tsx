import PostLikeButton from "@/components/post/post-like-button"
import PostReplyButton from "@/components/post/post-reply-button"
import PostRepostButton from "@/components/post/post-repost-button"
import LinkButton from "@/components/shared/link-button"
import { PostResponse } from "@/interfaces/post"
import { NULL_AVATAR } from "@/utils/constants"
import { dateTimeFormat } from "@/utils/date-format"
import formatTextWithHashtags from "@/utils/format-text-with-hashtags"
import Image from "next/image"
import { HiCheckBadge } from "react-icons/hi2"
import { twMerge } from "tailwind-merge"

export default function Post(props: Readonly<{ post: PostResponse; locale: string }>) {
    return (
        <article id="post-article" className="flex w-full flex-col gap-1">
            <LinkButton href={"/" + props.post.author.username} className="cursor-pointer" aria-label="Author Profile">
                <header className="mb-4 flex w-max items-center gap-2">
                    <Image
                        src={props.post.author.avatarImageUrl ?? NULL_AVATAR}
                        alt={props.post.author.username}
                        className="aspect-square h-10 w-10 rounded-full object-cover"
                        width={128}
                        height={128}
                        quality={50}
                    />
                    <div>
                        <p
                            className={twMerge(
                                "font-heading font-bold text-body-900",
                                props.post.author.isVerified && "flex items-center gap-1"
                            )}
                        >
                            {props.post.author.displayName}{" "}
                            {props.post.author.isVerified && (
                                <span className="text-accent-600" title="Verified">
                                    <HiCheckBadge size={22} />
                                </span>
                            )}
                        </p>
                        <p className="font-body text-body-500">@{props.post.author.username}</p>
                    </div>
                </header>
            </LinkButton>
            <p className="text-pretty text-body-900">
                {props.post.hashtags.length > 0
                    ? formatTextWithHashtags(props.post.text, props.post.hashtags)
                    : props.post.text}
            </p>
            <footer>
                <div className="flex w-max items-center gap-1">
                    <LinkButton
                        href={"/" + props.post.author.username + "/status/" + props.post.id}
                        className="text-body-500 hover:underline"
                    >
                        <time dateTime={props.post.createdAt}>
                            {dateTimeFormat(props.post.createdAt, props.locale)}
                        </time>
                    </LinkButton>
                    <p className="text-body-500">
                        · <strong>{props.post.viewsCount}</strong> Views
                    </p>
                </div>
                <div className="my-2 flex items-center justify-between border-y py-2">
                    <PostReplyButton post={props.post} />

                    <PostRepostButton post={props.post} />

                    <PostLikeButton post={props.post} />
                </div>
            </footer>
        </article>
    )
}
