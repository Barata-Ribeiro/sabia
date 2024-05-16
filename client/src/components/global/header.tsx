"use client"

import logout from "@/actions/auth/logout"
import { useUser } from "@/context/user-context-provider"
import { UserContextResponse } from "@/interfaces/user"
import { Link, usePathname, useRouter } from "@/navigation"
import { useLocale } from "next-intl"
import Image from "next/image"
import { useState } from "react"
import { HiBars3BottomLeft, HiXMark } from "react-icons/hi2"
import { TbPencilPlus } from "react-icons/tb"
import { twMerge } from "tailwind-merge"

export default function Header({ user }: { user: UserContextResponse | null }) {
    const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const localActive = useLocale()
    const pathname = usePathname()
    const router = useRouter()

    const menuLinksStyle = twMerge(
        `rounded-md px-3 py-2 text-sm font-medium`,
        `${pathname === "/home" ? "bg-background-900 text-body-50" : "text-body-300 hover:bg-background-700 hover:text-body-50"}`
    )

    const mobileMenuLinksStyle = twMerge(
        `block rounded-md px-3 py-2 text-base font-medium hover:text-body-50`,
        `${pathname === "/home" ? "bg-background-900 text-body-50" : "text-body-300 hover:bg-background-700"}`
    )

    const null_image = "/assets/default/profile-default-svgrepo-com.svg"

    const { setUser } = useUser()

    async function handleLogout() {
        await logout()
        setUser(null)
        router.push("/")
        router.refresh()
    }

    console.log(user)

    return (
        <header className="font-body text-body-600">
            <nav className="bg-background-800">
                <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                    <div className="relative flex h-16 items-center justify-between">
                        <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                            <button
                                type="button"
                                className="relative inline-flex items-center justify-center rounded-md p-2 text-body-400 hover:bg-background-700 hover:text-body-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-background-50"
                                aria-controls="mobile-menu"
                                aria-expanded="false"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                <span className="absolute -inset-0.5"></span>
                                <span className="sr-only">Open main menu</span>

                                {isMobileMenuOpen ? (
                                    <HiXMark size={24} />
                                ) : (
                                    <HiBars3BottomLeft size={24} />
                                )}
                            </button>
                        </div>
                        <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                            <div className="flex flex-shrink-0 items-center">
                                <Image
                                    src="/assets/logo-bird.svg"
                                    alt="Mini logo"
                                    className="h-8 w-auto"
                                    width={120}
                                    height={85}
                                    sizes="100vw"
                                    priority
                                />
                            </div>
                            <div className="hidden sm:ml-6 sm:block">
                                <div className="flex space-x-4">
                                    <Link
                                        locale={localActive}
                                        href="/home"
                                        className={menuLinksStyle}
                                        aria-current="page"
                                    >
                                        Home
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                            <button
                                type="button"
                                className="relative rounded-full bg-accent-400 p-1 text-body-900 hover:text-body-50 focus:outline-none focus:ring-2 focus:ring-background-50 focus:ring-offset-2 focus:ring-offset-accent-800"
                            >
                                <span className="absolute -inset-1.5"></span>
                                <span className="sr-only">New Post</span>
                                <TbPencilPlus size={24} />
                            </button>

                            <div className="relative ml-3">
                                <div>
                                    <button
                                        type="button"
                                        className="relative flex rounded-full bg-background-800 text-sm focus:outline-none focus:ring-2 focus:ring-background-50 focus:ring-offset-2 focus:ring-offset-background-800"
                                        id="user-menu-button"
                                        aria-expanded="false"
                                        aria-haspopup="true"
                                        onClick={() =>
                                            setIsAvatarMenuOpen(!isAvatarMenuOpen)
                                        }
                                    >
                                        <span className="absolute -inset-1.5"></span>
                                        <span className="sr-only">Open user menu</span>
                                        <Image
                                            className="h-8 w-8 rounded-full object-cover"
                                            src={user?.avatar_image_url ?? null_image}
                                            alt={`Avatar of ${user?.username}`}
                                            title={`Avatar of ${user?.username}`}
                                            width={256}
                                            height={256}
                                            quality={50}
                                        />
                                    </button>
                                </div>
                                <div
                                    className={`${isAvatarMenuOpen ? "absolute" : "hidden"} right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition-all focus:outline-none`}
                                    role="menu"
                                    aria-orientation="vertical"
                                    aria-labelledby="user-menu-button"
                                >
                                    <div>
                                        <p className="block select-none px-4 py-2 text-sm text-body-700">
                                            Welcome, @{user?.username}
                                        </p>

                                        <hr className="bg-background-100" />
                                    </div>
                                    <Link
                                        locale={localActive}
                                        href="#"
                                        className="block px-4 py-2 text-sm text-body-700"
                                        role="menuitem"
                                        tabIndex={-1}
                                        id="user-menu-item-0"
                                    >
                                        Your Profile
                                    </Link>
                                    <Link
                                        locale={localActive}
                                        href="#"
                                        className="block px-4 py-2 text-sm text-body-700"
                                        role="menuitem"
                                        tabIndex={-1}
                                        id="user-menu-item-1"
                                    >
                                        Settings
                                    </Link>
                                    <Link
                                        locale={localActive}
                                        href="/"
                                        onClick={handleLogout}
                                        className="block px-4 py-2 text-sm text-body-700"
                                        role="menuitem"
                                        tabIndex={-1}
                                        id="user-menu-item-2"
                                    >
                                        Sign out
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className={`${isMobileMenuOpen ? "block" : "hidden"} sm:hidden`}
                    id="mobile-menu"
                >
                    <div className="space-y-1 px-2 pb-3 pt-2">
                        <Link
                            locale={localActive}
                            href="/home"
                            className={mobileMenuLinksStyle}
                            aria-current="page"
                        >
                            Home
                        </Link>
                    </div>
                </div>
            </nav>
        </header>
    )
}
