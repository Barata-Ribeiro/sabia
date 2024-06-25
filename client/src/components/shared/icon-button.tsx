import tw from "@/utils/tw"
import type { ButtonHTMLAttributes } from "react"
import { twMerge } from "tailwind-merge"

export default function IconButton({
    children,
    className,
    ...props
}: Readonly<ButtonHTMLAttributes<HTMLButtonElement>>) {
    const sortedClasses = tw`cursor-pointer select-none text-center align-middle font-heading text-body-950 transition-all focus:outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none dark:text-body-50`

    const mergedClassName = twMerge(sortedClasses, className)

    return (
        <button type="button" className={mergedClassName} {...props}>
            {children}
        </button>
    )
}
