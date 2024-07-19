import { type ReactNode } from "react"

export default function Default({
    children
}: Readonly<{
    children: Readonly<ReactNode>
}>) {
    return <>{children}</>
}
