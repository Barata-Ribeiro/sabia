import IconButton from "@/components/shared/icon-button"
import { usePathname, useRouter } from "@/navigation"
import { useTranslations } from "next-intl"
import { HiMiniArrowLeft, HiMiniArrowRight } from "react-icons/hi2"
import { twMerge } from "tailwind-merge"

interface CircularPaginationProps {
    totalPages: number
    page: number
    searchParams?: { [key: string]: string | string[] | undefined }
}

export default function CircularPagination({
    totalPages,
    page,
    searchParams
}: CircularPaginationProps) {
    const t = useTranslations("Feed.CircularPagination")
    const router = useRouter()
    const pathname = usePathname()

    const goToPage = (pageNumber: number) => {
        if (searchParams) {
            searchParams.page = pageNumber.toString()
            router.push(`${pathname}?q=${searchParams.q as string}&page=${pageNumber}`)
        } else router.push(`${pathname}?page=${pageNumber}`)
    }

    const handlePrev = () => {
        if (page > 0) goToPage(page - 1)
    }

    const handleNext = () => {
        if (page < totalPages - 1) goToPage(page + 1)
    }

    const handlePageInput = () => {
        let pageInput = prompt(t("Prompt") + totalPages)
        let pageNumber = pageInput ? parseInt(pageInput) : NaN
        while (isNaN(pageNumber) || pageNumber < 1 || pageNumber > totalPages) {
            pageInput = prompt(t("Prompt") + totalPages)
            pageNumber = pageInput ? parseInt(pageInput) : NaN
        }
        goToPage(pageNumber - 1)
    }

    return (
        <div className="my-2 flex flex-col items-center justify-center gap-4 md:flex-row">
            <IconButton
                type="button"
                className="flex items-center gap-2 rounded-full px-6 py-3 text-xs font-bold uppercase text-body-900 hover:bg-background-100 active:bg-background-200"
                onClick={handlePrev}
                disabled={page === 0}
                aria-disabled={page === 0}
                aria-label={t("AriaLabelPrevious")}
            >
                <HiMiniArrowLeft size={16} /> {t("PrevButton")}
            </IconButton>
            <div className="flex flex-wrap items-center gap-2">
                {totalPages > 1 &&
                    [...Array(totalPages)].map((_, index) => {
                        if (
                            totalPages <= 4 ||
                            index === 0 ||
                            index === totalPages - 1 ||
                            Math.abs(page - index) <= 1
                        ) {
                            return (
                                <IconButton
                                    key={index}
                                    className={twMerge(
                                        "h-10 max-h-[40px] w-10 max-w-[40px] rounded-full text-xs font-bold uppercase text-body-900 hover:bg-background-100 active:bg-background-200",
                                        page === index && "bg-background-300"
                                    )}
                                    onClick={() => goToPage(index)}
                                    aria-label={t("AriaLabelPage") + (index + 1)}
                                >
                                    {index + 1}
                                </IconButton>
                            )
                        } else if (index === page - 2 || index === page + 2) {
                            return (
                                <IconButton
                                    key={index}
                                    className="h-10 max-h-[40px] w-10 max-w-[40px] rounded-full text-xs font-bold uppercase text-body-900 hover:bg-background-100 active:bg-background-200"
                                    onClick={handlePageInput}
                                    aria-label={t("AriaLabelInput")}
                                >
                                    ...
                                </IconButton>
                            )
                        }
                        return null
                    })}
            </div>
            <IconButton
                type="button"
                className="flex items-center gap-2 rounded-full px-6 py-3 text-xs font-bold uppercase text-body-900 hover:bg-background-100 active:bg-background-200"
                onClick={handleNext}
                disabled={page === totalPages - 1}
                aria-disabled={page === totalPages - 1}
                aria-label={t("AriaLabelNext")}
            >
                {t("NextButton")}
                <HiMiniArrowRight size={16} />
            </IconButton>
        </div>
    )
}
