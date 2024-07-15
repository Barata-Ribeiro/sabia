import AsideMenu from "@/components/menu/aside-menu"
import TrendingMenu from "@/components/menu/trending-menu"
import { unstable_setRequestLocale } from "next-intl/server"
import { ReactNode } from "react"

interface SettingsLayoutProps {
    children: Readonly<ReactNode>
    deleteModal: ReactNode | null
    params: { locale: string }
}

export default function SettingsLayout({ children, deleteModal = null, params }: Readonly<SettingsLayoutProps>) {
    unstable_setRequestLocale(params.locale)

    return (
        <main role="main" className="flex h-full font-body">
            <AsideMenu />
            {children}
            {deleteModal}
            <TrendingMenu />
        </main>
    )
}
