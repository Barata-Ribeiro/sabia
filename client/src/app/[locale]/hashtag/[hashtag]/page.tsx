import getPostsByHashtag from "@/actions/post/get-posts-by-hashtag"
import AsideMenu from "@/components/menu/aside-menu"
import LinkButton from "@/components/shared/link-button"
import { PostResponse, PostsHashtagResponse } from "@/interfaces/post"
import { HiArrowUturnLeft } from "react-icons/hi2"

interface HashtagPageProps {
    params: { hashtag: string }
}

export default async function HashtagPage({ params }: HashtagPageProps) {
    const postsState = await getPostsByHashtag({ hashtag: params.hashtag })
    const data = postsState.response?.data as PostsHashtagResponse
    const posts = data.posts as PostResponse[]

    return (
        <main role="main" className="flex h-full">
            <AsideMenu />
            <section
                id="content"
                className="max-w-[37.5rem] flex-1 overflow-y-scroll border-x"
            >
                <div className="sticky top-0 w-full border-b p-4">
                    <div className="flex w-max items-center gap-6 text-2xl">
                        <LinkButton
                            href="/home"
                            className="cursor-pointer rounded-full p-2 hover:bg-background-100"
                        >
                            <HiArrowUturnLeft size={24} />
                        </LinkButton>
                        <h2 className="cursor-default font-heading font-semibold">
                            Posts with #{params.hashtag}
                        </h2>
                    </div>
                </div>
            </section>
        </main>
    )
}
