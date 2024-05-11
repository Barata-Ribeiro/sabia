import tw from "@/utils/tw"
import type { ButtonHTMLAttributes } from "react"
import { twMerge } from "tailwind-merge"

export default function Button({
    children,
    className,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    const sortedClasses = tw`min-h-fit w-full flex-1 select-none
                                    rounded-lg bg-accent-500 text-body-950 ring-accent-600 transition-all
                                    hover:bg-accent-600 focus:outline-none active:bg-accent-700 ${
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
