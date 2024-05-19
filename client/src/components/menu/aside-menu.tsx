"use client"

import logout from "@/actions/auth/logout"
import Input from "@/components/shared/input"
import { useUser } from "@/context/user-context-provider"
import { Link, useRouter } from "@/navigation"
import { useLocale } from "next-intl"
import { FaCircleUser, FaMagnifyingGlass, FaPowerOff } from "react-icons/fa6"
import { HiWrenchScrewdriver } from "react-icons/hi2"

export default function AsideMenu() {
    const { user } = useUser()
    const localeActive = useLocale()
    const router = useRouter()

    return (
        <aside
            id="sidebar"
            className="relative flex h-full w-full max-w-[20rem] flex-col divide-y bg-clip-border text-gray-700"
        >
            <form action="" className="my-4 py-2 sm:mx-6 lg:mx-8">
                <Input
                    label="Search"
                    icon={<FaMagnifyingGlass size={20} />}
                    type="search"
                    className="px-3 py-2.5 !pr-9"
                    required
                    aria-required
                />
            </form>
            <nav className="flex min-w-[240px] flex-col gap-1 px-2 py-4 text-body-700 sm:px-6 lg:px-8">
                <Link
                    locale={localeActive}
                    href={"/" + user?.username}
                    className="flex w-full items-center rounded-lg p-3 text-start leading-tight outline-none transition-all hover:bg-background-200 hover:bg-opacity-80 hover:text-body-900 focus:bg-background-100 focus:bg-opacity-80 focus:text-body-800 active:bg-background-50 active:bg-opacity-80 active:text-body-700"
                >
                    <div className="mr-4 grid place-items-center">
                        <FaCircleUser size={20} />
                    </div>
                    Profile
                </Link>
                <Link
                    locale={localeActive}
                    href="/settings"
                    className="flex w-full items-center rounded-lg p-3 text-start leading-tight outline-none transition-all hover:bg-background-200 hover:bg-opacity-80 hover:text-body-900 focus:bg-background-100 focus:bg-opacity-80 focus:text-body-800 active:bg-background-50 active:bg-opacity-80 active:text-body-700"
                >
                    <div className="mr-4 grid place-items-center">
                        <HiWrenchScrewdriver size={20} />
                    </div>
                    Settings
                </Link>
                <button
                    type="button"
                    onClick={async () => await logout()}
                    aria-label="Log Out"
                    className="flex w-full items-center rounded-lg p-3 text-start leading-tight outline-none transition-all hover:bg-background-200 hover:bg-opacity-80 hover:text-body-900 focus:bg-background-100 focus:bg-opacity-80 focus:text-body-800 active:bg-background-50 active:bg-opacity-80 active:text-body-700"
                >
                    <div className="mr-4 grid place-items-center">
                        <FaPowerOff size={20} />
                    </div>
                    Log Out
                </button>
            </nav>
        </aside>
    )
}
