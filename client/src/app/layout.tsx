import { ReactNode } from "react"
import "./styles.css"

interface Props {
    children: ReactNode
}

export default function RootLayout({ children }: Props) {
    return children
}
