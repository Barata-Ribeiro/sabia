import AsideMenu from "@/components/menu/aside-menu"
import type { ReactNode } from "react"

interface UsernameLayoutProps {
    children: Readonly<ReactNode>
    replyModal: ReactNode
}

export default function UsernameLayout({
    children,
    replyModal = null
}: UsernameLayoutProps) {
    return (
        <main role="main" className="flex h-full font-body">
            <AsideMenu />
            {children}
            {replyModal}
        </main>
    )
}
