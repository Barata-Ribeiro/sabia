"use client"

import LinkButton from "@/components/shared/link-button"
import { useUser } from "@/context/user-context-provider"
import Image from "next/image"
import Logo from "../../../public/assets/logo.svg"

export default function SecondaryHeader() {
    const { user } = useUser()

    return (
        <header className="sticky left-0 top-0 px-4 pt-4 md:px-0">
            <div className="mx-auto block w-full rounded-xl border border-white/80 bg-white bg-opacity-80 px-6 py-3 shadow-md backdrop-blur-2xl backdrop-saturate-200">
                <nav aria-label="Secondary Navigation" className="flex items-center justify-between text-body-900">
                    <LinkButton href="/" className="flex-initial">
                        <Image
                            src={Logo}
                            alt="Sabiá - Logo"
                            title="Sabiá - Logo"
                            className="h-auto w-32 py-1.5 italic antialiased sm:w-40"
                        />
                    </LinkButton>
                    <ul className="flex items-center justify-evenly gap-6">
                        <li className="block w-max p-1 font-sans text-sm font-medium leading-normal text-body-900 antialiased">
                            <LinkButton href="/" className="flex items-center transition-colors hover:text-accent-500">
                                Home
                            </LinkButton>
                        </li>
                        {user && (
                            <li className="block w-max p-1 font-sans text-sm font-medium leading-normal text-body-900 antialiased">
                                <LinkButton
                                    className="flex items-center rounded-md bg-accent-500 px-2 py-1 text-body-900 transition-colors hover:bg-secondary-500 active:bg-primary-500"
                                    href={"/p/" + user?.username + "/new-post"}
                                >
                                    New Post
                                </LinkButton>
                            </li>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    )
}
