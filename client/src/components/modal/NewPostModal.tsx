"use client"

import { useUser } from "@/context/user-context-provider"
import { useRouter } from "@/navigation"
import Image from "next/image"
import {
    type ElementRef,
    type MouseEvent as ReactMouseEvent,
    useCallback,
    useEffect,
    useRef
} from "react"

export default function NewPostModal() {
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
            className="flex rounded-lg shadow-lg backdrop:bg-black/40 backdrop:backdrop-blur-sm"
        >
            <div className="mx-auto flex size-fit flex-col items-start justify-between bg-white p-4 font-body">
                <header className="font-heading">
                    <h1>New Post</h1>
                </header>
                <div className="flex gap-4">
                    <Image
                        src={user?.avatar_image_url}
                        alt={`${user?.username}'s avatar`}
                        width={50}
                        height={50}
                        priority
                        className="h-12 w-12 rounded-full object-cover"
                    />
                    <form action="">
                        <textarea
                            name="content"
                            id="content"
                            className="form-textarea"
                            cols={30}
                            rows={10}
                        ></textarea>
                    </form>
                </div>
                <footer>
                    <button onClick={() => dismiss()}>Close</button>
                </footer>
            </div>
        </dialog>
    )
}
