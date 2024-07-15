import getQuerySearch from "@/actions/get-query-search"
import PaginatedFeed from "@/components/feed/paginated-feed"
import AsideMenu from "@/components/menu/aside-menu"
import ProfileEntity from "@/components/profile/profile-entity"
import LinkButton from "@/components/shared/link-button"
import { PostSearchResponse } from "@/interfaces/post"
import { UserSearchResponse } from "@/interfaces/user"
import getBase64 from "@/utils/get-base64"
import { unstable_setRequestLocale } from "next-intl/server"
import { notFound, redirect } from "next/navigation"
import { HiArrowUturnLeft } from "react-icons/hi2"

interface SearchPageProps {
    params: { locale: string }
    searchParams: { [key: string]: string | string[] | undefined }
}

type resolvedListOfBlurredDataUrl = ({
    userId: string
    blurredDataUrl: string | undefined
} | null)[]

export default async function SearchPage({ params, searchParams }: Readonly<SearchPageProps>) {
    unstable_setRequestLocale(params.locale)
    if (!searchParams.q) return notFound()

    let page = 0
    if (!searchParams.page) return redirect(params.locale + "/search?q=" + searchParams.q + "&page=0")
    else page = parseInt(searchParams.page as string)

    const query = searchParams.q as string
    const fetchType = query.startsWith("@") ? "user" : "post"
    const searchState = await getQuerySearch(params.locale, query, fetchType, page)
    const searchResponse =
        fetchType === "user"
            ? (searchState.response?.data as UserSearchResponse)
            : (searchState.response?.data as PostSearchResponse)

    let listOfBlurredDataUrl = []
    let resolvedListOfBlurredDataUrl: resolvedListOfBlurredDataUrl = []
    if (searchResponse && fetchType === "user") {
        listOfBlurredDataUrl = (searchResponse as UserSearchResponse).users.map(async (user) => {
            if (!user.avatarImageUrl) return null
            return {
                userId: user.id,
                blurredDataUrl: await getBase64(user.avatarImageUrl, params.locale)
            }
        })

        resolvedListOfBlurredDataUrl = await Promise.all(listOfBlurredDataUrl)
    }

    return (
        <main role="main" className="flex h-full">
            <AsideMenu />
            <section id="search-section" className="w-full flex-1 overflow-y-scroll border-x md:max-w-[38rem]">
                <div className="sticky top-0 flex w-full border-b bg-background-50 p-4">
                    <div className="flex items-center gap-6 text-2xl">
                        <LinkButton
                            href="/home"
                            className="cursor-pointer rounded-full p-2 hover:bg-background-100"
                            aria-label="Back to home"
                        >
                            <HiArrowUturnLeft size={24} />
                        </LinkButton>
                        <h2 className="cursor-default font-heading font-semibold">
                            Search results for &rdquot; {query} &ldquot;
                        </h2>
                    </div>
                </div>

                {searchResponse && fetchType === "user" ? (
                    (searchResponse as UserSearchResponse).users.map((user, index) => (
                        <ProfileEntity
                            key={user.id + "-" + index}
                            user={user}
                            resolvedListOfBlurredDataUrl={resolvedListOfBlurredDataUrl}
                            totalPages={(searchResponse as UserSearchResponse).totalPages}
                            page={page}
                        />
                    ))
                ) : (
                    <PaginatedFeed
                        feedResponse={searchResponse as PostSearchResponse}
                        page={page}
                        searchParams={searchParams}
                    />
                )}
            </section>
        </main>
    )
}
