"use client"

import { usePathname, useRouter } from "@/navigation"
import { ChangeEvent, ReactNode, useTransition } from "react"

interface LocaleSwitcherSelectProps {
    children: ReactNode
    defaultValue: string
}

export default function LocaleSwitcherSelect({ children, defaultValue }: Readonly<LocaleSwitcherSelectProps>) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const pathname = usePathname()

    function onSelectChange(event: ChangeEvent<HTMLSelectElement>) {
        const nextLocale = event.target.value
        startTransition(() => router.replace(pathname, { locale: nextLocale }))
    }

    return (
        <label className="ml-2 rounded-md bg-white shadow max-sm:mt-2">
            <p className="sr-only">Change Language</p>
            <select
                defaultValue={defaultValue}
                className="form-select cursor-pointer appearance-none rounded-md border-none bg-transparent text-body-950 focus:ring-accent-600"
                onChange={onSelectChange}
                disabled={isPending}
                aria-label="Language Selector"
            >
                {children}
            </select>
        </label>
    )
}
