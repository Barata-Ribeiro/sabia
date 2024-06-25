"use client"

import NewPostForm from "@/components/forms/new-post-form"
import Button from "@/components/shared/button"
import { useUser } from "@/context/user-context-provider"
import { useRouter } from "@/navigation"
import { NULL_AVATAR } from "@/utils/constants"
import { useTranslations } from "next-intl"
import Image from "next/image"
import {
    type ElementRef,
    type MouseEvent as ReactMouseEvent,
    useCallback,
    useEffect,
    useRef
} from "react"

export default function NewPostModal() {
    const t = useTranslations("NewPostModal")
    const router = useRouter()
    const dialogRef = useRef<ElementRef<"dialog">>(null)
    const { user } = useUser()

    const dismiss = useCallback(() => {
        router.back()
    }, [router])

    useEffect(() => dialogRef.current?.showModal(), [])

    function handleOutsideClick(event: ReactMouseEvent<HTMLDialogElement, MouseEvent>) {
        event.target === dialogRef.current && router.back()
    }

    return (
        <dialog
            ref={dialogRef}
            onClick={handleOutsideClick}
            onClose={router.back}
            aria-labelledby="dialogTitle"
            className="flex rounded-lg shadow-lg backdrop:bg-black/40 backdrop:backdrop-blur-sm"
        >
            <div className="mx-auto flex size-fit flex-col items-start justify-between gap-8 rounded-lg border border-background-900 bg-white p-4 font-body">
                <header className="font-heading">
                    <h4
                        id="dialogTitle"
                        className="text-blue-gray-900 block font-sans text-2xl font-semibold leading-snug tracking-normal antialiased"
                    >
                        {t("NewPostTitle")}
                    </h4>
                    <p className="mt-1 block font-sans text-base font-normal leading-relaxed text-gray-700 antialiased">
                        {t("NewPostSubtitle")}
                    </p>
                </header>
                <article className="flex gap-4">
                    <Image
                        src={user?.avatarImageUrl ?? NULL_AVATAR}
                        alt={`${t("NewPostAvatarAlt")}${user?.username}`}
                        width={50}
                        height={50}
                        priority
                        className="h-12 w-12 rounded-full object-cover"
                    />
                    <NewPostForm />
                </article>
                <footer>
                    <Button
                        type="button"
                        className="bg-transparent px-4 py-2 text-center align-middle font-heading text-xs font-bold uppercase text-body-900 transition-all hover:bg-background-100 active:bg-background-200"
                        onClick={() => dismiss()}
                    >
                        {t("NewPostCloseButton")}
                    </Button>
                </footer>
            </div>
        </dialog>
    )
}
