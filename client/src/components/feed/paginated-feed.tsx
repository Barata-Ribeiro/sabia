"use client"

import FeedPost from "@/components/feed/feed-post"
import IconButton from "@/components/shared/icon-button"
import { PostsHashtagResponse } from "@/interfaces/post"
import { usePathname, useRouter } from "next/navigation"
import { HiMiniArrowLeft, HiMiniArrowRight } from "react-icons/hi2"
import { twMerge } from "tailwind-merge"

interface PaginatedFeedProps {
    feedResponse: PostsHashtagResponse
    page: number
}

export default function PaginatedFeed({ feedResponse, page }: PaginatedFeedProps) {
    const router = useRouter()
    const pathname = usePathname()

    const goToPage = (pageNumber: number) => {
        router.push(`${pathname}?page=${pageNumber}`)
    }

    const handlePrev = () => {
        if (page > 0) goToPage(page - 1)
    }

    const handleNext = () => {
        if (page < feedResponse.total_pages - 1) goToPage(page + 1)
    }

    const handlePageInput = () => {
        let pageInput = prompt(
            `Type the page between 1 and ${feedResponse.total_pages}`
        )
        let pageNumber = pageInput ? parseInt(pageInput) : NaN
        while (
            isNaN(pageNumber) ||
            pageNumber < 1 ||
            pageNumber > feedResponse.total_pages
        ) {
            pageInput = prompt(
                `Type the page between 1 and ${feedResponse.total_pages}`
            )
            pageNumber = pageInput ? parseInt(pageInput) : NaN
        }
        goToPage(pageNumber - 1)
    }

    return (
        <>
            <ul className="flex snap-y flex-col divide-y" role="list">
                {feedResponse.posts.map((post) => (
                    <FeedPost post={post} key={post.id} />
                ))}
            </ul>

            {/*PAGINATION*/}
            {feedResponse.total_pages > 1 && (
                <div className="my-2 flex flex-col items-center justify-center gap-4 md:flex-row">
                    <IconButton
                        type="button"
                        className="flex items-center gap-2 rounded-full px-6 py-3 text-xs font-bold uppercase text-body-900 hover:bg-background-100 active:bg-background-200"
                        onClick={handlePrev}
                        disabled={page === 0}
                    >
                        <HiMiniArrowLeft size={16} /> Previous
                    </IconButton>
                    <div className="flex items-center gap-2">
                        {Array.from({
                            length: Math.min(feedResponse.total_pages, 2)
                        }).map((_, index) => (
                            <IconButton
                                key={index}
                                className={twMerge(
                                    "h-10 max-h-[40px] w-10 max-w-[40px] rounded-full text-xs font-bold uppercase text-body-900 hover:bg-background-100 active:bg-background-200",
                                    page === index && "bg-background-300"
                                )}
                                onClick={() => goToPage(index)}
                            >
                                {index + 1}
                            </IconButton>
                        ))}
                        {feedResponse.total_pages > 5 && (
                            <IconButton
                                className={twMerge(
                                    "h-10 max-h-[40px] w-10 max-w-[40px] rounded-full text-xs font-bold uppercase text-body-900 hover:bg-background-100 active:bg-background-200",
                                    page > 1 &&
                                        page < feedResponse.total_pages - 2 &&
                                        "bg-background-300"
                                )}
                                onClick={handlePageInput}
                            >
                                ...
                            </IconButton>
                        )}
                        {Array.from({
                            length: Math.min(feedResponse.total_pages, 2)
                        }).map((_, index) => (
                            <IconButton
                                key={index}
                                className={twMerge(
                                    "h-10 max-h-[40px] w-10 max-w-[40px] rounded-full text-xs font-bold uppercase text-body-900 hover:bg-background-100 active:bg-background-200",
                                    page === feedResponse.total_pages - 2 + index &&
                                        "bg-background-300"
                                )}
                                onClick={() =>
                                    goToPage(feedResponse.total_pages - 2 + index)
                                }
                            >
                                {feedResponse.total_pages - 1 + index}
                            </IconButton>
                        ))}
                    </div>
                    <IconButton
                        type="button"
                        className="flex items-center gap-2 rounded-full px-6 py-3 text-xs font-bold uppercase text-body-900 hover:bg-background-100 active:bg-background-200"
                        onClick={handleNext}
                        disabled={page === feedResponse.total_pages - 1}
                    >
                        Next
                        <HiMiniArrowRight size={16} />
                    </IconButton>
                </div>
            )}
        </>
    )
}
