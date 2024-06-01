"use client"

import CircularPagination from "@/components/feed/circular-pagination"
import { PostsHashtagResponse } from "@/interfaces/post"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { twMerge } from "tailwind-merge"

interface PaginatedFeedProps {
    feedResponse: PostsHashtagResponse
    hashtag: string
    page: number
}

export default function PaginatedFeed({
    feedResponse,
    hashtag,
    page
}: PaginatedFeedProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const goToPage = (pageNumber: number) => {
        router.push(`${pathname}?page=${pageNumber}`)
    }

    const handlePrev = () => {
        if (page > 0) {
            goToPage(page - 1)
        }
    }

    const handleNext = () => {
        if (page < feedResponse.total_pages - 1) {
            goToPage(page + 1)
        }
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
        <div>
            <div>
                {feedResponse.posts.map((post) => (
                    <div key={post.id}>
                        <p>{post.author.username}</p>
                        <p>{post.text}</p>
                    </div>
                ))}
            </div>

            {/*PAGINATION*/}
            <CircularPagination
                onClick={handlePrev}
                page={page}
                values={feedResponse.total_pages}
                callbackfn={(_, index) => (
                    <button
                        key={index}
                        className={twMerge(
                            "cursor-pointer rounded-full px-2 py-1 hover:bg-background-100",
                            page === index && "bg-background-100"
                        )}
                        onClick={() => goToPage(index)}
                    >
                        {index + 1}
                    </button>
                )}
                onClick1={handlePageInput}
                callbackfn1={(_, index) => (
                    <button
                        key={index}
                        className={twMerge(
                            "cursor-pointer rounded-full px-2 py-1 hover:bg-background-100",
                            page === feedResponse.total_pages - 2 + index &&
                                "bg-background-100"
                        )}
                        onClick={() => goToPage(feedResponse.total_pages - 2 + index)}
                    >
                        {feedResponse.total_pages - 1 + index}
                    </button>
                )}
                onClick2={handleNext}
            />
        </div>
    )
}
