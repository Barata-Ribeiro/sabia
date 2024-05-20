import { Link } from "@/navigation"
import tw from "@/utils/tw"
import { useLocale } from "next-intl"
import type { Url } from "next/dist/shared/lib/router/router"
import type { AnchorHTMLAttributes } from "react"
import { twMerge } from "tailwind-merge"

export default function LinkButton({
    children,
    className,
    ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
    const localeActive = useLocale()

    const sortedClasses = tw`min-h-fit flex-1 select-none focus:outline-none`
    const mergedClassName = twMerge(sortedClasses, className)

    return (
        <Link
            locale={localeActive}
            href={props.href as Url}
            className={mergedClassName}
            {...props}
        >
            {children}
        </Link>
    )
}
