import AsideMenu from "@/components/menu/aside-menu"
import TrendingMenu from "@/components/menu/trending-menu"
import { unstable_setRequestLocale } from "next-intl/server"
import type { ReactNode } from "react"

interface UsernameLayoutProps {
    children: Readonly<ReactNode>
    replyModal: ReactNode
    params: { locale: string }
}

export default function UsernameLayout({ children, replyModal = null, params }: Readonly<UsernameLayoutProps>) {
    unstable_setRequestLocale(params.locale)
    return (
        <main role="main" className="flex h-full font-body">
            <AsideMenu />
            {children}
            {replyModal}
            <TrendingMenu />
        </main>
    )
}
