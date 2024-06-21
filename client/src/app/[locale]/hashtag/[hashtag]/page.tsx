import getPostsByHashtag from "@/actions/post/get-posts-by-hashtag"
import PaginatedFeed from "@/components/feed/paginated-feed"
import AsideMenu from "@/components/menu/aside-menu"
import TrendingMenu from "@/components/menu/trending-menu"
import LinkButton from "@/components/shared/link-button"
import { PostsHashtagResponse } from "@/interfaces/post"
import { redirect } from "@/navigation"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { notFound } from "next/navigation"
import { HiArrowUturnLeft } from "react-icons/hi2"

interface HashtagPageProps {
    params: { hashtag: string }
    searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({
    params,
    searchParams
}: HashtagPageProps): Promise<Metadata> {
    const t = await getTranslations("HashtagPage")

    return {
        title: t("title") + params.hashtag + " | Sabiá",
        description: t("description") + params.hashtag + " on page " + searchParams.page
    }
}

export default async function HashtagPage({ params, searchParams }: HashtagPageProps) {
    if (!params.hashtag) return notFound()

    const t = await getTranslations("HashtagPage")

    let page = 0
    if (!searchParams.page) return redirect("/hashtag/" + params.hashtag + "?page=0")
    else page = parseInt(searchParams.page as string)

    const postsState = await getPostsByHashtag({ hashtag: params.hashtag, page })
    const hashtagResponse = postsState.response?.data as PostsHashtagResponse

    return (
        <main role="main" className="flex h-full" aria-label={t("AriaLabelMain")}>
            <AsideMenu />
            <section
                id="hashtag-section"
                className="w-full flex-1 overflow-y-scroll border-x md:max-w-[38rem]"
                aria-label={t("AriaLabelHashtag")}
            >
                <div className="sticky top-0 flex w-full border-b bg-background-50 p-4">
                    <div className="flex items-center gap-6 text-2xl">
                        <LinkButton
                            href="/home"
                            className="cursor-pointer rounded-full p-2 hover:bg-background-100"
                            aria-label={t("AriaLabelBackButton")}
                        >
                            <HiArrowUturnLeft size={24} />
                        </LinkButton>
                        <h2 className="cursor-default font-heading font-semibold">
                            {t("title")}
                            {params.hashtag}
                        </h2>
                    </div>
                </div>

                {hashtagResponse ? (
                    <PaginatedFeed feedResponse={hashtagResponse} page={page} />
                ) : (
                    <p className="text-center">{t("PageEmptyPosts")}</p>
                )}
            </section>
            <TrendingMenu />
        </main>
    )
}
