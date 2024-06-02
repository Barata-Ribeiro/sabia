"use client"

import CircularPagination from "@/components/feed/circular-pagination"
import FeedPost from "@/components/feed/feed-post"
import { PostsHashtagResponse } from "@/interfaces/post"
import { useTranslations } from "next-intl"

interface PaginatedFeedProps {
    feedResponse: PostsHashtagResponse
    page: number
}

export default function PaginatedFeed({ feedResponse, page }: PaginatedFeedProps) {
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

            {feedResponse.total_pages > 1 && (
                <CircularPagination totalPages={feedResponse.total_pages} page={page} />
            )}
        </>
    )
}
