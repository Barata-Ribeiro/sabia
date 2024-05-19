import getUserContext from "@/actions/user/get-user-context"
import getUserFeed from "@/actions/user/get-user-feed"
import PrivateFeed from "@/components/feed/private-feed"
import AsideMenu from "@/components/menu/aside-menu"
import { FeedResponse, UserContextResponse } from "@/interfaces/user"

export default async function HomePage() {
    const context = await getUserContext()
    const user: UserContextResponse =
        (context.response?.data as UserContextResponse) ?? ""

    const feedState = await getUserFeed({ userId: user.id })
    const feed = feedState.response?.data as FeedResponse

    return (
        <main role="main" className="flex h-full">
            <AsideMenu />
            <section id="content" className="flex flex-col gap-4 divide-y border-l">
                <div id="new-post">
                    <h2 className="font-heading text-xl">Your Feed</h2>
                </div>
                <div id="feed" className="w-full flex-1 overflow-y-scroll">
                    {feed && feed.feed.length > 0 ? (
                        <PrivateFeed feedResponse={feed} userId={user.id} />
                    ) : (
                        <p className="text-center">No posts to display</p>
                    )}
                </div>
            </section>
        </main>
    )
}
