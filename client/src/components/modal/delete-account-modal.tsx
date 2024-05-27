"use client"

import DeleteAccountForm from "@/components/forms/delete-account-form"
import { useRouter } from "@/navigation"
import {
    type ElementRef,
    type MouseEvent as ReactMouseEvent,
    useEffect,
    useRef
} from "react"
import { HiOutlineExclamationCircle } from "react-icons/hi2"

export default function DeleteAccountModal() {
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
            className="flex rounded-lg shadow-lg backdrop:bg-black/40 backdrop:backdrop-blur-sm"
        >
            <div className="mx-auto flex size-fit flex-col items-start justify-between gap-8 rounded-lg border border-background-900 bg-white p-4 font-body">
                <header>
                    <h1 className="font-heading text-2xl font-semibold text-body-900 dark:text-body-100">
                        Delete Account
                    </h1>
                    <p className="text-body-900 dark:text-body-100">
                        Proceed with caution. Deleting your account is irreversible.
                    </p>
                </header>
                <article className="flex w-full flex-col items-center justify-center gap-4">
                    <h2 className="flex flex-col items-center justify-center gap-2">
                        <HiOutlineExclamationCircle
                            size={50}
                            className="text-red-600"
                        />
                        <span className="text-center font-heading text-xl font-semibold">
                            Your account will be deleted permanently!
                        </span>
                    </h2>
                    <p className="max-w-[80ch] text-pretty leading-6">
                        Per our terms of service, when you delete your account, all your
                        data will be permanently erased, and there will be no way to
                        recover it. This action is irreversible and final. The reason
                        for complete data deletion is to ensure the privacy and security
                        of your account and our platform. If you are sure you want to
                        delete your account, type your username below followed by the
                        word &rdquo;<strong>-DELETE</strong>&ldquo; to confirm.
                    </p>
                    <DeleteAccountForm />
                </article>
            </div>
        </dialog>
    )
}
