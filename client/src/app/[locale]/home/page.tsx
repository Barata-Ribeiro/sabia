import getUserContext from "@/actions/user/get-user-context"
import getUserFeed from "@/actions/user/get-user-feed"
import Feed from "@/components/feed/feed"
import NewPostFeedForm from "@/components/forms/new-post-feed-form"
import AsideMenu from "@/components/menu/aside-menu"
import TrendingMenu from "@/components/menu/trending-menu"
import { FeedResponse, UserContextResponse } from "@/interfaces/user"
import { Metadata } from "next"
import { getTranslations, unstable_setRequestLocale } from "next-intl/server"

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
    unstable_setRequestLocale(params.locale)
    const t = await getTranslations({ locale: params.locale, namespace: "HomePage" })

    return {
        title: t("title"),
        description: t("description")
    }
}

export default async function HomePage({
    params
}: Readonly<{
    params: { locale: string }
}>) {
    unstable_setRequestLocale(params.locale)
    const t = await getTranslations({ locale: params.locale, namespace: "HomePage" })

    const context = await getUserContext()
    const user: UserContextResponse = (context.response?.data as UserContextResponse) ?? ""

    const feedState = await getUserFeed({ userId: user.id })
    const feedResponse = feedState.response?.data as FeedResponse

    return (
        <main role="main" className="flex h-full" aria-label={t("AriaLabelMain")}>
            <AsideMenu />
            <div id="content" className="flex w-full flex-col gap-4 divide-y overflow-y-scroll border-x md:w-max">
                <section id="private-new-post" className="px-4 pt-4" aria-label={t("AriaLabelNewPost")}>
                    <h2 className="font-heading text-xl">{t("PageTitle")}</h2>
                    <NewPostFeedForm />
                </section>
                <section id="private-feed" className="w-full flex-1 md:max-w-[37.5rem]" aria-label={t("AriaLabelFeed")}>
                    {feedResponse ? (
                        <Feed feedResponse={feedResponse} userId={user.id} isPublic={false} />
                    ) : (
                        <p className="text-center">{t("PageEmptyPosts")}</p>
                    )}
                </section>
            </div>
            <TrendingMenu />
        </main>
    )
}
