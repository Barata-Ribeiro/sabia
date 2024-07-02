import AsideMenu from "@/components/menu/aside-menu"
import TrendingMenu from "@/components/menu/trending-menu"
import type { ReactNode } from "react"

interface UsernameLayoutProps {
    children: Readonly<ReactNode>
    replyModal: ReactNode
}

export default function UsernameLayout({
    children,
    replyModal = null
}: Readonly<UsernameLayoutProps>) {
    return (
        <main role="main" className="flex h-full font-body">
            <AsideMenu />
            {children}
            {replyModal}
            <TrendingMenu />
        </main>
    )
}
