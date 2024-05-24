import getPost from "@/actions/post/get-post"
import LinkButton from "@/components/shared/link-button"
import { PostResponse } from "@/interfaces/post"
import { NULL_AVATAR } from "@/utils/constants"
import { dateTimeFormat } from "@/utils/date-format"
import { Metadata } from "next"
import { getLocale } from "next-intl/server"
import Image from "next/image"
import {
    HiArrowUturnLeft,
    HiCheckBadge,
    HiHeart,
    HiMiniArrowPath,
    HiOutlineChatBubbleOvalLeft
} from "react-icons/hi2"
import { twMerge } from "tailwind-merge"

interface PostPageProps {
    params: {
        username: string
        id: string
    }
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
    const localeActive = await getLocale()

    const postState = await getPost({ id: params.id, locale: localeActive })
    const post = postState.response?.data as PostResponse

    return {
        title:
            post.author.display_name + " on Sabiá: " + post.text.slice(0, 600) + "...",
        description: "Post by " + post.author.display_name + " on Sabiá. - " + post.text
    }
}

export default async function PostPage({ params }: PostPageProps) {
    const localeActive = await getLocale()

    const postState = await getPost({ id: params.id, locale: localeActive })
    const post = postState.response?.data as PostResponse

    return (
        <section className="max-w-[37.5rem] flex-1 border-x">
            <div className="mb-4 w-full p-4 shadow-md">
                <div className="flex w-max items-center gap-6 text-2xl">
                    <LinkButton
                        href={"/" + params.username}
                        className="cursor-pointer rounded-full p-2 hover:bg-background-100"
                    >
                        <HiArrowUturnLeft size={24} />
                    </LinkButton>
                    <h2 className="cursor-default font-heading font-semibold">Post</h2>
                </div>
            </div>
            <div className="w-full px-4">
                <article
                    id="post-article"
                    role="article"
                    className="flex flex-col
                gap-1"
                >
                    <LinkButton
                        href={"/" + post.author.username}
                        className="cursor-pointer"
                        aria-label="Author Profile"
                    >
                        <header className="mb-4 flex w-max items-center gap-2">
                            <Image
                                src={post.author.avatar_image_url ?? NULL_AVATAR}
                                alt={post.author.username}
                                className="aspect-square h-10 w-10 rounded-full object-cover"
                                width={128}
                                height={128}
                                quality={50}
                            />
                            <div>
                                <p
                                    className={twMerge(
                                        "font-heading font-bold text-body-900",
                                        post.author.is_verified &&
                                            "flex items-center gap-1"
                                    )}
                                >
                                    {post.author.display_name}{" "}
                                    {post.author.is_verified && (
                                        <span
                                            className="text-accent-600"
                                            title="Verified"
                                        >
                                            <HiCheckBadge size={22} />
                                        </span>
                                    )}
                                </p>
                                <p className="font-body text-body-500">
                                    @{post.author.username}
                                </p>
                            </div>
                        </header>
                    </LinkButton>
                    <p className="text-pretty text-body-900">{post.text}</p>
                    <footer>
                        <div className="flex w-max items-center gap-1">
                            <LinkButton
                                href={"/" + post.author.username + "/status/" + post.id}
                                className="text-body-500 hover:underline"
                            >
                                <time dateTime={post.created_at}>
                                    {dateTimeFormat(post.created_at, localeActive)}
                                </time>
                            </LinkButton>
                            <p className="text-body-500">
                                · <strong>{post.views_count}</strong> Views
                            </p>
                        </div>
                        <div className="my-2 flex items-center justify-between border-y py-2">
                            <div
                                id="post-reply"
                                className="flex w-max items-center gap-2"
                                title="Reply"
                                aria-label="Reply Count"
                            >
                                <HiOutlineChatBubbleOvalLeft
                                    size={24}
                                    aria-hidden="true"
                                />
                                <p>{post.reply_count}</p>
                            </div>

                            <div
                                id="post-repost"
                                className="flex w-max items-center gap-2"
                                title="Repost"
                                aria-label="Repost Count"
                            >
                                <HiMiniArrowPath size={24} />
                                <p>{post.repost_count}</p>
                            </div>

                            <div
                                id="post-like"
                                className="flex w-max items-center gap-2"
                                title="Like"
                                aria-label="Like Count"
                            >
                                <HiHeart size={24} />
                                <p>{post.like_count}</p>
                            </div>
                        </div>
                    </footer>
                </article>
            </div>
        </section>
    )
}
