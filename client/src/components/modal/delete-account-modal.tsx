"use client"

import DeleteAccountForm from "@/components/forms/delete-account-form"
import { useRouter } from "@/navigation"
import { useTranslations } from "next-intl"
import { type ElementRef, type MouseEvent as ReactMouseEvent, useEffect, useRef } from "react"
import { HiOutlineExclamationCircle } from "react-icons/hi2"

export default function DeleteAccountModal() {
    const t = useTranslations("DeleteAccountModal")
    const router = useRouter()
    const dialogRef = useRef<ElementRef<"dialog">>(null)

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
            className="flex rounded-lg shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)] backdrop-filter backdrop:bg-black/40 backdrop:backdrop-blur-sm"
        >
            <div className="mx-auto flex size-fit flex-col items-start justify-between gap-8 rounded-lg bg-white p-4 font-body">
                <header>
                    <h1 className="font-heading text-2xl font-semibold text-body-900 dark:text-body-100">
                        {t("DeleteAccountTitle")}
                    </h1>
                    <p className="text-body-900 dark:text-body-100">{t("DeleteAccountDescription")}</p>
                </header>
                <article className="flex w-full flex-col items-center justify-center gap-4">
                    <h2 className="flex flex-col items-center justify-center gap-2">
                        <HiOutlineExclamationCircle size={50} className="text-red-600" />
                        <span className="text-center font-heading text-xl font-semibold">
                            {t("DeleteAccountWarning")}
                        </span>
                    </h2>
                    <p className="max-w-[80ch] text-pretty leading-6">
                        {t("DeleteAccountParagraph")} &rdquo;{/* */}
                        <strong>-DELETE</strong>&ldquo;
                    </p>
                    <DeleteAccountForm />
                </article>
            </div>
        </dialog>
    )
}
