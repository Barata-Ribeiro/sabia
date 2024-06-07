"use client"

import Input from "@/components/shared/input"
import { useRouter } from "@/navigation"
import { type KeyboardEvent, useState } from "react"
import { FaMagnifyingGlass } from "react-icons/fa6"

export default function SearchForm() {
    const router = useRouter()
    const [search, setSearch] = useState("")

    function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
        if (search.trim() === "") return

        if (event.key === "Enter") {
            event.preventDefault()
            event.stopPropagation()
            router.push("/search?q=" + event.currentTarget.value + "&page=0")
        }
    }

    return (
        <form className="my-4 py-2 sm:mx-6 lg:mx-8">
            <Input
                label="Search"
                name="search"
                icon={<FaMagnifyingGlass size={20} />}
                type="search"
                className="px-3 py-2.5 !pr-9"
                onKeyDown={handleKeyDown}
                value={search}
                onChange={(event) => setSearch(event.currentTarget.value)}
                required
                aria-required
            />
        </form>
    )
}
