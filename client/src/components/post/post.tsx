import PostLikeButton from "@/components/post/post-like-button"
import LinkButton from "@/components/shared/link-button"
import { PostResponse } from "@/interfaces/post"
import { NULL_AVATAR } from "@/utils/constants"
import { dateTimeFormat } from "@/utils/date-format"
import Image from "next/image"
import {
    HiCheckBadge,
    HiMiniArrowPath,
    HiOutlineChatBubbleOvalLeft
} from "react-icons/hi2"
import { twMerge } from "tailwind-merge"

export default function Post(props: { post: PostResponse; locale: string }) {
    return (
        <article id="post-article" role="article" className="flex flex-col gap-1">
            <LinkButton
                href={"/" + props.post.author.username}
                className="cursor-pointer"
                aria-label="Author Profile"
            >
                <header className="mb-4 flex w-max items-center gap-2">
                    <Image
                        src={props.post.author.avatar_image_url ?? NULL_AVATAR}
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
                                props.post.author.is_verified &&
                                    "flex items-center gap-1"
                            )}
                        >
                            {props.post.author.display_name}{" "}
                            {props.post.author.is_verified && (
                                <span className="text-accent-600" title="Verified">
                                    <HiCheckBadge size={22} />
                                </span>
                            )}
                        </p>
                        <p className="font-body text-body-500">
                            @{props.post.author.username}
                        </p>
                    </div>
                </header>
            </LinkButton>
            <p className="text-pretty text-body-900">{props.post.text}</p>
            <footer>
                <div className="flex w-max items-center gap-1">
                    <LinkButton
                        href={
                            "/" +
                            props.post.author.username +
                            "/status/" +
                            props.post.id
                        }
                        className="text-body-500 hover:underline"
                    >
                        <time dateTime={props.post.created_at}>
                            {dateTimeFormat(props.post.created_at, props.locale)}
                        </time>
                    </LinkButton>
                    <p className="text-body-500">
                        · <strong>{props.post.views_count}</strong> Views
                    </p>
                </div>
                <div className="my-2 flex items-center justify-between border-y py-2">
                    <div
                        id="post-reply"
                        className="flex w-max items-center gap-2"
                        title="Reply"
                        aria-label="Reply Count"
                    >
                        <HiOutlineChatBubbleOvalLeft size={24} aria-hidden="true" />
                        <p>{props.post.reply_count}</p>
                    </div>

                    <div
                        id="post-repost"
                        className="flex w-max items-center gap-2"
                        title="Repost"
                        aria-label="Repost Count"
                    >
                        <HiMiniArrowPath size={24} />
                        <p>{props.post.repost_count}</p>
                    </div>

                    <PostLikeButton post={props.post} />
                </div>
            </footer>
        </article>
    )
}