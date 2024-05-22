"use client"

import logout from "@/actions/auth/logout"
import Input from "@/components/shared/input"
import LinkButton from "@/components/shared/link-button"
import { useUser } from "@/context/user-context-provider"
import { useRouter } from "@/navigation"
import { useTranslations } from "next-intl"
import { FaCircleUser, FaMagnifyingGlass, FaPowerOff } from "react-icons/fa6"
import { HiCheckBadge, HiWrenchScrewdriver } from "react-icons/hi2"

export default function AsideMenu() {
    const { user } = useUser()
    const { setUser } = useUser()
    const t = useTranslations("AsideMenu")
    const router = useRouter()

    async function handleLogout() {
        await logout()
        setUser(null)
        router.push("/")
        router.refresh()
    }

    return (
        <aside
            id="sidebar"
            className="relative hidden h-full w-full max-w-[20rem] flex-col divide-y bg-clip-border text-gray-700 md:flex"
        >
            <form action="" className="my-4 py-2 sm:mx-6 lg:mx-8">
                <Input
                    label={t("InputSearch")}
                    name="search"
                    icon={<FaMagnifyingGlass size={20} />}
                    type="search"
                    className="px-3 py-2.5 !pr-9"
                    required
                    aria-required
                />
            </form>
            <nav
                role="navigation"
                className="flex min-w-[240px] flex-col gap-1 px-2 py-4 font-heading text-body-700 sm:px-6 lg:px-8"
            >
                <LinkButton
                    href={"/" + user?.username}
                    className="flex w-full items-center rounded-lg p-3 text-start leading-tight outline-none transition-all hover:bg-background-200 hover:bg-opacity-80 hover:text-body-900 focus:bg-background-100 focus:bg-opacity-80 focus:text-body-800 active:bg-background-50 active:bg-opacity-80 active:text-body-700"
                >
                    <div className="mr-4 grid place-items-center">
                        <FaCircleUser size={20} />
                    </div>
                    {t("ButtonProfile")}
                </LinkButton>
                {!user?.is_verified && (
                    <LinkButton
                        href={"/" + user?.username + "/verify"}
                        className="flex w-full items-center rounded-lg p-3 text-start leading-tight outline-none transition-all hover:bg-background-200 hover:bg-opacity-80 hover:text-body-900 focus:bg-background-100 focus:bg-opacity-80 focus:text-body-800 active:bg-background-50 active:bg-opacity-80 active:text-body-700"
                    >
                        <div className="mr-4 grid place-items-center">
                            <HiCheckBadge size={20} />
                        </div>
                        {t("ButtonVerify")}
                    </LinkButton>
                )}
                <LinkButton
                    href="/settings"
                    className="flex w-full items-center rounded-lg p-3 text-start leading-tight outline-none transition-all hover:bg-background-200 hover:bg-opacity-80 hover:text-body-900 focus:bg-background-100 focus:bg-opacity-80 focus:text-body-800 active:bg-background-50 active:bg-opacity-80 active:text-body-700"
                >
                    <div className="mr-4 grid place-items-center">
                        <HiWrenchScrewdriver size={20} />
                    </div>
                    {t("ButtonSettings")}
                </LinkButton>
                <button
                    type="button"
                    onClick={handleLogout}
                    aria-label="Log Out"
                    className="flex w-full items-center rounded-lg p-3 text-start leading-tight outline-none transition-all hover:bg-background-200 hover:bg-opacity-80 hover:text-body-900 focus:bg-background-100 focus:bg-opacity-80 focus:text-body-800 active:bg-background-50 active:bg-opacity-80 active:text-body-700"
                >
                    <div className="mr-4 grid place-items-center">
                        <FaPowerOff size={20} />
                    </div>
                    {t("ButtonLogout")}
                </button>
            </nav>
        </aside>
    )
}
