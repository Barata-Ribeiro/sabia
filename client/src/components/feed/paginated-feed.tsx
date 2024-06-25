"use client"

import CircularPagination from "@/components/feed/circular-pagination"
import FeedPost from "@/components/feed/feed-post"
import { PostSearchResponse, PostsHashtagResponse } from "@/interfaces/post"
import { useTranslations } from "next-intl"

interface PaginatedFeedProps {
    feedResponse: PostsHashtagResponse | PostSearchResponse
    page: number
    searchParams?: { [key: string]: string | string[] | undefined }
}

export default function PaginatedFeed({
    feedResponse,
    page,
    searchParams
}: PaginatedFeedProps) {
    const t = useTranslations("Feed.Paginated")

    return (
        <>
            <ul
                className="flex snap-y flex-col divide-y"
                role="list"
                aria-label={t("AriaLabelList")}
            >
                {feedResponse.posts.map((post) => (
                    <FeedPost post={post} key={post.id} />
                ))}
            </ul>

            {feedResponse.totalPages > 1 && (
                <CircularPagination
                    totalPages={feedResponse.totalPages}
                    page={page}
                    searchParams={searchParams}
                />
            )}
        </>
    )
}
