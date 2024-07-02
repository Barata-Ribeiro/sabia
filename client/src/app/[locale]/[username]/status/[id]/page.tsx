import getPost from "@/actions/post/get-post"
import Post from "@/components/post/post"
import Repost from "@/components/post/repost"
import LinkButton from "@/components/shared/link-button"
import { PostResponse } from "@/interfaces/post"
import { Metadata } from "next"
import { getLocale } from "next-intl/server"
import { HiArrowUturnLeft } from "react-icons/hi2"

interface PostPageProps {
    params: { username: string; id: string }
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
    const localeActive = await getLocale()

    const postState = await getPost({ id: params.id, locale: localeActive })
    const post = postState.response?.data as PostResponse

    return {
        title:
            post.author.displayName + " on Sabiá: " + post.text.slice(0, 600) + "...",
        description: "Post by " + post.author.displayName + " on Sabiá. - " + post.text
    }
}

export default async function PostPage({ params }: Readonly<PostPageProps>) {
    const localeActive = await getLocale()

    const postState = await getPost({ id: params.id, locale: localeActive })
    const post = postState.response?.data as PostResponse

    return (
        <section className="w-full flex-1 border-x md:max-w-[37.5rem]">
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
                {post.repostOff !== null ? (
                    <Repost post={post} locale={localeActive} />
                ) : (
                    <Post post={post} locale={localeActive} />
                )}
            </div>
        </section>
    )
}
