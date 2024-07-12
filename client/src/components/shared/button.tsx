import tw from "@/utils/tw"
import type { ButtonHTMLAttributes } from "react"
import { twMerge } from "tailwind-merge"

export default function Button({ children, className, ...props }: Readonly<ButtonHTMLAttributes<HTMLButtonElement>>) {
    const sortedClasses = tw`min-h-fit w-full flex-1 select-none rounded-lg bg-accent-500 text-center align-middle text-body-900 ring-accent-600 transition-all hover:bg-accent-600 focus:outline-none active:bg-accent-700 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none dark:text-body-50`

    const mergedClassName = twMerge(sortedClasses, className)

    return (
        <button className={mergedClassName} {...props}>
            {children}
        </button>
    )
}
