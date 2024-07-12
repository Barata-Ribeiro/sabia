"use client"

import deleteUserAccount from "@/actions/user/delete-user-account"
import Button from "@/components/shared/button"
import Input from "@/components/shared/input"
import { useUser } from "@/context/user-context-provider"
import { useRouter } from "@/navigation"
import { useCallback, useEffect } from "react"
import { useFormState, useFormStatus } from "react-dom"
import { FaCircleExclamation } from "react-icons/fa6"

export default function DeleteAccountForm() {
    const router = useRouter()
    const { user, setUser } = useUser()

    const dismiss = useCallback(() => {
        router.back()
    }, [router])

    const { pending } = useFormStatus()
    const [state, action] = useFormState(deleteUserAccount, {
        // EDIT ACTION!!!
        ok: false,
        clientError: null,
        response: null
    })

    useEffect(() => {
        if (state.ok) {
            setUser(null)
            router.push("/")
            router.refresh()
        }
    }, [state.ok, router, setUser])

    return (
        <form action={action}>
            <div className="flex flex-col gap-1">
                <input className="hidden" type="hidden" name="userId" value={user?.id} />
                <input className="hidden" type="hidden" name="username" value={user?.username} />
                <Input
                    label="Username"
                    name="usernameDelete"
                    autoComplete="off"
                    className="px-3 py-2.5"
                    required
                    aria-required
                />
                <p className="flex w-fit items-center gap-2 self-center text-sm text-primary-700 antialiased">
                    <FaCircleExclamation size={14} />
                    <span className="max-w-[55ch]">
                        Type your username followed by the word &rdquo;
                        {/*
                         */}
                        <strong>-DELETE</strong>&ldquo; to confirm.
                    </span>
                </p>
            </div>
            <div className="mt-4 flex items-center justify-center gap-6">
                <Button
                    type="button"
                    onClick={() => dismiss()}
                    className="bg-gray-500 py-2 text-white hover:bg-gray-600 active:bg-gray-700"
                    disabled={pending}
                    aria-disabled={pending}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    className="bg-red-500 py-2 text-white hover:bg-red-600 active:bg-red-700"
                    disabled={pending}
                    aria-disabled={pending}
                >
                    {pending ? "Deleting..." : "Delete"}
                </Button>
            </div>
            {state.clientError && <p>{state.clientError}</p>}
        </form>
    )
}
