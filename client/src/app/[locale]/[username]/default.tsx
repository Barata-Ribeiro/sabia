import { type ReactNode } from "react"

export default function Default({ children }: { children: Readonly<ReactNode> }) {
    return <>{children}</>
}
