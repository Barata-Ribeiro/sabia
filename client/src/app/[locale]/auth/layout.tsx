import { unstable_setRequestLocale } from "next-intl/server"
import { type ReactNode } from "react"

interface AuthLayoutProps {
    children: ReactNode
    params: { locale: string }
}

export default function AuthLayout({ children, params }: Readonly<AuthLayoutProps>) {
    unstable_setRequestLocale(params.locale)
    return <main className="flex flex-1 flex-col items-center justify-center font-body">{children}</main>
}
