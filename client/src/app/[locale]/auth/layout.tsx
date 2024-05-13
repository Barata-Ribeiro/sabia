import { type ReactNode } from "react"

export default function AuthLayout({ children }: { children: Readonly<ReactNode> }) {
    return (
        <main className="flex flex-1 flex-col items-center justify-center font-body">
            {children}
        </main>
    )
}
