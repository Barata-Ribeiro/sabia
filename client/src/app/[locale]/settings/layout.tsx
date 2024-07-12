import AsideMenu from "@/components/menu/aside-menu"
import TrendingMenu from "@/components/menu/trending-menu"
import { ReactNode } from "react"

interface SettingsLayoutProps {
    children: Readonly<ReactNode>
    deleteModal: ReactNode | null
}

export default function SettingsLayout({ children, deleteModal = null }: Readonly<SettingsLayoutProps>) {
    return (
        <main role="main" className="flex h-full font-body">
            <AsideMenu />
            {children}
            {deleteModal}
            <TrendingMenu />
        </main>
    )
}
