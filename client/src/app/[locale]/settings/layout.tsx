import AsideMenu from "@/components/menu/aside-menu"
import type { ReactNode } from "react"

export default function Layout({ children }: { children: Readonly<ReactNode> }) {
    return (
        <main role="main" className="flex h-full font-body">
            <AsideMenu />
            {children}
        </main>
    )
}
