import getUserContext from "@/actions/user/get-user-context"
import getUserFeed from "@/actions/user/get-user-feed"
import NewPostFeed from "@/components/feed/new-post-feed"
import PrivateFeed from "@/components/feed/private-feed"
import AsideMenu from "@/components/menu/aside-menu"
import { FeedResponse, UserContextResponse } from "@/interfaces/user"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

export async function generateMetadata({
    params
}: {
    params: { locale: string }
}): Promise<Metadata> {
    const t = await getTranslations({ locale: params.locale, namespace: "HomePage" })

    return {
        title: t("title"),
        description: t("description")
    }
}

export default async function HomePage({ params }: { params: { locale: string } }) {
    const t = await getTranslations({ locale: params.locale, namespace: "HomePage" })

    const context = await getUserContext()
    const user: UserContextResponse =
        (context.response?.data as UserContextResponse) ?? ""

    const feedState = await getUserFeed({ userId: user.id })
    const feed = feedState.response?.data as FeedResponse

    return (
        <main role="main" className="flex h-full " aria-label={t("AriaLabelMain")}>
            <AsideMenu />
            <div
                id="content"
                className=" to_limit flex w-max flex-col gap-4 divide-y overflow-y-scroll border-x"
            >
                <section
                    id="new-post"
                    className="p-4"
                    aria-label={t("AriaLabelNewPost")}
                >
                    <h2 className="font-heading text-xl">{t("PageTitle")}</h2>
                    <NewPostFeed />
                </section>
                <section
                    id="feed"
                    className="max-w-[37.5rem] flex-1"
                    aria-label={t("AriaLabelFeed")}
                >
                    {feed && feed.feed.length > 0 ? (
                        <PrivateFeed feedResponse={feed} userId={user.id} />
                    ) : (
                        <p className="text-center">{t("PageEmptyPosts")}</p>
                    )}
                </section>
            </div>
        </main>
    )
}
