"use client"

import logout from "@/actions/auth/logout"
import LinkButton from "@/components/shared/link-button"
import { useUser } from "@/context/user-context-provider"
import { UserContextResponse } from "@/interfaces/user"
import { usePathname } from "@/navigation"
import { NULL_AVATAR } from "@/utils/constants"
import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    MenuSeparator,
    Transition
} from "@headlessui/react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { Fragment } from "react"
import { HiBars3BottomLeft, HiXMark } from "react-icons/hi2"
import { TbPencilPlus } from "react-icons/tb"
import { twMerge } from "tailwind-merge"
import sabiaLogo from "../../../public/assets/logo-bird.svg"

export default function Header({
    user
}: Readonly<{
    user: UserContextResponse | null
}>) {
    const t = useTranslations("Header")
    const pathname = usePathname()
    const { setUser } = useUser()

    const shouldNotRender =
        pathname === "/privacy-policy" ||
        pathname === "/terms-of-use" ||
        pathname === "/about" ||
        pathname === "/auth/register" ||
        pathname === "/"

    const menuLinksStyle = twMerge(
        "inline-flex items-center border-b-4 border-accent-500 px-1 pt-2 text-sm font-medium ",
        `${
            pathname === "/home"
                ? "bg-background-900 text-body-50"
                : "text-body-300 hover:bg-background-700 hover:text-body-50 active:border-accent-500 active:bg-background-900 active:text-body-50"
        }`
    )

    const disclosureButtonStyle = twMerge(
        "block border-l-4 border-accent-500 py-2 pl-3 pr-4 font-medium",
        `${
            pathname === "/home"
                ? "bg-background-900 text-body-50"
                : "text-body-300 hover:bg-background-700 hover:text-body-50 active:border-accent-500 active:bg-background-900 active:text-body-50"
        }`
    )

    async function handleLogout() {
        await logout()
        setUser(null)
        window.location.href = "/"
    }

    if (shouldNotRender) return null

    return (
        <Disclosure as="nav" className="bg-background-800 shadow">
            {({ open }) => (
                <>
                    <div className="container mx-auto px-2 font-body sm:px-6 lg:px-8">
                        <div className="relative flex h-16 justify-between">
                            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                {/* Mobile menu button */}
                                <DisclosureButton className="inline-flex items-center justify-center rounded-md border border-background-700 p-2 text-body-600 hover:bg-background-100 hover:text-body-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent-500">
                                    <span className="sr-only">{t("NavSRMainMenu")}</span>
                                    {open ? (
                                        <HiXMark className="block h-6 w-6" aria-hidden="true" />
                                    ) : (
                                        <HiBars3BottomLeft className="block h-6 w-6" aria-hidden="true" />
                                    )}
                                </DisclosureButton>
                            </div>
                            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                                <div className="flex flex-shrink-0 items-center">
                                    <Image src={sabiaLogo} alt="Mini logo" className="h-8 w-auto" priority />
                                </div>
                                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                    <LinkButton href="/home" className={menuLinksStyle} aria-current="page">
                                        {t("NavMenuHome")}
                                    </LinkButton>
                                </div>
                            </div>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                {pathname !== "/home" && (
                                    <LinkButton
                                        href={"/p/" + user?.username + "/new-post"}
                                        className="relative rounded-full bg-accent-400 p-1 text-body-900 hover:text-body-50 focus:outline-none focus:ring-2 focus:ring-background-50 focus:ring-offset-2 focus:ring-offset-accent-800"
                                    >
                                        <span className="absolute -inset-1.5"></span>
                                        <span className="sr-only">{t("NavSRNewPost")}</span>
                                        <TbPencilPlus size={24} />
                                    </LinkButton>
                                )}

                                {/* Profile dropdown */}
                                <Menu as="div" className="relative ml-3">
                                    <div>
                                        <MenuButton className="flex rounded-full bg-background-950 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2">
                                            <span className="sr-only">{t("NavSRUseMenu")}</span>
                                            <Image
                                                className="h-8 w-8 rounded-full"
                                                src={user?.avatarImageUrl ?? NULL_AVATAR}
                                                alt={`${t("NavUserImageAlt")} ${user?.username}`}
                                                title={`${t("NavUserImageAlt")} ${user?.username}`}
                                                width={256}
                                                height={256}
                                                quality={50}
                                            />
                                        </MenuButton>
                                    </div>
                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-200"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                            <MenuItem>
                                                <LinkButton
                                                    href={"/" + user?.username}
                                                    className="block px-4 py-2 text-sm text-body-700 hover:bg-gray-100"
                                                >
                                                    {t("NavUserMenuProfile")}
                                                </LinkButton>
                                            </MenuItem>
                                            <LinkButton
                                                href="/settings"
                                                className="block px-4 py-2 text-sm text-body-700 hover:bg-gray-100"
                                            >
                                                {t("NavUserMenuSettings")}
                                            </LinkButton>
                                            <MenuSeparator className="my-1 h-px bg-background-100" />
                                            <LinkButton
                                                href="/"
                                                onClick={handleLogout}
                                                className="block px-4 py-2 text-sm text-body-700 hover:bg-gray-100"
                                            >
                                                {t("NavUserMenuLogout")}
                                            </LinkButton>
                                        </MenuItems>
                                    </Transition>
                                </Menu>
                            </div>
                        </div>
                    </div>

                    <DisclosurePanel className="sm:hidden">
                        <div className="space-y-1 pb-4 pt-2">
                            <DisclosureButton as="a" href="/home" className={disclosureButtonStyle}>
                                {t("NavMenuHome")}
                            </DisclosureButton>
                        </div>
                    </DisclosurePanel>
                </>
            )}
        </Disclosure>
    )
}
