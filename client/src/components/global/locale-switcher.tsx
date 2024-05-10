"use client"

import { useLocale } from "next-intl"
import { useRouter } from "next/navigation"
import { type ChangeEvent, useTransition } from "react"

export default function LocaleSwitcher() {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const localActive = useLocale()

    const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const nextLocale = e.target.value
        startTransition(() => router.replace(`/${nextLocale}`))
    }

    return (
        <label className="rounded-md shadow max-sm:mt-2">
            <p className="sr-only">Change Language</p>
            <select
                defaultValue={localActive}
                className="text-body-950 focus:ring-accent-600 form-select cursor-pointer appearance-none rounded-md border-none bg-transparent"
                onChange={onSelectChange}
                disabled={isPending}
                aria-label="Language Selector"
            >
                <option value="" disabled>
                    Language
                </option>
                <option value="en">English</option>
                <option value="pt-BR">Portuguese</option>
            </select>
        </label>
    )
}
