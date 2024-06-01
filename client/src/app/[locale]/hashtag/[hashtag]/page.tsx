import getPostsByHashtag from "@/actions/post/get-posts-by-hashtag"
import PaginatedFeed from "@/components/feed/paginated-feed"
import AsideMenu from "@/components/menu/aside-menu"
import LinkButton from "@/components/shared/link-button"
import { PostsHashtagResponse } from "@/interfaces/post"
import { redirect } from "@/navigation"
import { notFound } from "next/navigation"
import { HiArrowUturnLeft } from "react-icons/hi2"

interface HashtagPageProps {
    params: { hashtag: string }
    searchParams: { [key: string]: string | string[] | undefined }
}

export default async function HashtagPage({ params, searchParams }: HashtagPageProps) {
    if (!params.hashtag) return notFound()

    let page = 0
    if (!searchParams.page) return redirect(`/hashtag/${params.hashtag}?page=0`)
    else page = parseInt(searchParams.page as string)

    const postsState = await getPostsByHashtag({ hashtag: params.hashtag, page })
    const hashtagResponse = postsState.response?.data as PostsHashtagResponse

    return (
        <main role="main" className="flex h-full">
            <AsideMenu />
            <section
                id="hashtag-section"
                className="max-w-[37.5rem] flex-1 overflow-y-scroll border-x"
            >
                <div className="sticky top-0 flex w-full border-b bg-background-50 p-4">
                    <div className="flex items-center gap-6 text-2xl">
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

                <PaginatedFeed feedResponse={hashtagResponse} page={page} />
            </section>
        </main>
    )
}
