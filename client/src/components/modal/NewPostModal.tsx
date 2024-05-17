"use client"

import Button from "@/components/shared/button"
import { useUser } from "@/context/user-context-provider"
import { useRouter } from "@/navigation"
import { type EmojiClickData, EmojiStyle } from "emoji-picker-react"

import dynamic from "next/dynamic"
import Image from "next/image"
import {
    type ElementRef,
    type MouseEvent as ReactMouseEvent,
    useCallback,
    useEffect,
    useRef,
    useState
} from "react"

const EmojiPicker = dynamic(
    () => {
        return import("emoji-picker-react")
    },
    { ssr: false }
)

export default function NewPostModal() {
    const router = useRouter()
    const dialogRef = useRef<ElementRef<"dialog">>(null)
    const { user } = useUser()
    const [text, setText] = useState("")

    const dismiss = useCallback(() => {
        router.back()
    }, [router])

    useEffect(() => dialogRef.current?.showModal(), [])

    function handleOutsideClick(event: ReactMouseEvent<HTMLDialogElement, MouseEvent>) {
        event.target === dialogRef.current && router.back()
    }

    function handleEmojiClick(emojiData: EmojiClickData, event: MouseEvent) {
        let sym = emojiData.emoji
        setText((prevText) => prevText + sym)
    }

    return (
        <dialog
            ref={dialogRef}
            onClick={handleOutsideClick}
            onClose={router.back}
            className="flex rounded-lg shadow-lg backdrop:bg-black/40 backdrop:backdrop-blur-sm"
        >
            <div className="mx-auto flex size-fit flex-col items-start justify-between gap-8 rounded-lg border border-background-900 bg-white p-4 font-body">
                <header className="font-heading">
                    <h4 className="text-blue-gray-900 block font-sans text-2xl font-semibold leading-snug tracking-normal antialiased">
                        New Post
                    </h4>
                    <p className="mt-1 block font-sans text-base font-normal leading-relaxed text-gray-700 antialiased">
                        Share your thoughts with the world.
                    </p>
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
                        <div className="relative w-[32rem]">
                            <div className="relative w-full min-w-[200px]">
                                <textarea
                                    id="new-post"
                                    name="newPost"
                                    rows={8}
                                    className="peer h-full min-h-[100px] w-full !resize-none rounded-[7px] border border-background-200 border-t-transparent bg-transparent px-3 py-2.5 text-body-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-background-200 placeholder-shown:border-t-background-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-background-50"
                                    placeholder=" "
                                    value={text}
                                    onChange={(event) => setText(event.target.value)}
                                ></textarea>
                                <label className="before:content[' '] after:content[' '] pointer-events-none absolute -top-1.5 left-0 flex h-full w-full select-none text-[11px] font-normal leading-tight text-body-400 transition-all before:pointer-events-none before:mr-1 before:mt-[6.5px] before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-l before:border-t before:border-background-200 before:transition-all after:pointer-events-none after:ml-1 after:mt-[6.5px] after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-r after:border-t after:border-background-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-body-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-l-2 peer-focus:before:border-t-2 peer-focus:before:!border-gray-900 peer-focus:after:border-r-2 peer-focus:after:border-t-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-body-500">
                                    New Post
                                </label>
                            </div>
                            <div className="flex w-full justify-between py-1.5">
                                <EmojiPicker
                                    lazyLoadEmojis={true}
                                    emojiStyle={EmojiStyle.NATIVE}
                                    reactionsDefaultOpen
                                    allowExpandReactions={false}
                                    onReactionClick={handleEmojiClick}
                                />
                                <Button
                                    type="submit"
                                    className="flex-shrink-0 flex-grow-0 px-10 py-2 text-center align-middle font-heading"
                                >
                                    Post
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
                <footer>
                    <Button
                        type="button"
                        className="bg-transparent px-4 py-2 text-center align-middle font-heading text-xs font-bold uppercase text-body-900 transition-all hover:bg-background-100 active:bg-background-200"
                        onClick={() => dismiss()}
                    >
                        Close
                    </Button>
                </footer>
            </div>
        </dialog>
    )
}
