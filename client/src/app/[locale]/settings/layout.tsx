import AsideMenu from "@/components/menu/aside-menu"
import { ReactNode } from "react"

interface SettingsLayoutProps {
    children: Readonly<ReactNode>
    deleteModal?: ReactNode | null
}

export default function SettingsLayout({
    children,
    deleteModal = null
}: SettingsLayoutProps) {
    return (
        <main role="main" className="flex h-full font-body">
            <AsideMenu />
            {children}
            {deleteModal}
        </main>
    )
}
