import tw from "@/utils/tw"
import type { ButtonHTMLAttributes } from "react"
import { twMerge } from "tailwind-merge"

export default function Button({
    children,
    className,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    const sortedClasses = tw`min-h-fit flex-1 select-none focus:outline-none ${
        props.disabled
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer" + "hover:opacity-100"
    }`
    const mergedClassName = twMerge(sortedClasses, className)

    return (
        <button className={mergedClassName} {...props}>
            {children}
        </button>
    )
}
