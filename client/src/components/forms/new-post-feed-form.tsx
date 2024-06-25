"use client"

import postNewPost from "@/actions/post/post-new-post"
import Button from "@/components/shared/button"
import { useRouter } from "@/navigation"
import tw from "@/utils/tw"
import { type EmojiClickData, EmojiStyle, Theme } from "emoji-picker-react"
import { useTranslations } from "next-intl"
import dynamic from "next/dynamic"
import { type MouseEvent, useEffect, useRef, useState } from "react"
import { useFormState, useFormStatus } from "react-dom"
import { HiMiniFaceSmile } from "react-icons/hi2"
import { twMerge } from "tailwind-merge"

const EmojiPicker = dynamic(
    () => {
        return import("emoji-picker-react")
    },
    { ssr: false }
)

export default function NewPostFeedForm() {
    const t = useTranslations("NewPostFeedForm")
    const [text, setText] = useState("")
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false)
    const emojiPickerRef = useRef<HTMLSpanElement>(null)
    const emojiButtonRef = useRef<HTMLButtonElement>(null)

    const router = useRouter()

    const textAreaStyles = tw`peer h-full min-h-[6.25rem] w-full !resize-none rounded-[0.438rem] border border-background-200 border-t-transparent bg-white px-3 py-2.5 text-body-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-background-200 placeholder-shown:border-t-background-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-background-50`

    const textAreaLabelStyles = tw`before:content[' '] after:content[' '] pointer-events-none absolute -top-1.5 left-0 flex h-full w-full select-none text-[0.688rem] font-normal leading-tight text-body-400 transition-all before:pointer-events-none before:mr-1 before:mt-[0.406rem] before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-l before:border-t before:border-background-200 before:transition-all after:pointer-events-none after:ml-1 after:mt-[0.406rem] after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-r after:border-t after:border-background-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-body-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[0.688rem] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-l-2 peer-focus:before:border-t-2 peer-focus:before:!border-gray-900 peer-focus:after:border-r-2 peer-focus:after:border-t-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-body-500`

    function handleEmojiClick(emojiData: EmojiClickData, event: globalThis.MouseEvent) {
        event.preventDefault()
        let sym = emojiData.emoji
        setText((prevText) => prevText + sym)
    }

    function handleEmojiPickerToggle(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        event.stopPropagation()
        setEmojiPickerOpen((prev) => !prev)
    }

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                emojiButtonRef.current &&
                emojiButtonRef.current.contains(event.target as Node)
            ) {
                return
            }

            if (
                emojiPickerRef.current &&
                !emojiPickerRef.current.contains(event.target as Node)
            ) {
                setEmojiPickerOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside as any)
        return () =>
            document.removeEventListener("mousedown", handleClickOutside as any)
    }, [emojiPickerRef, emojiButtonRef])

    const { pending } = useFormStatus()
    const [state, action] = useFormState(postNewPost, {
        ok: false,
        clientError: null,
        response: null
    })

    useEffect(() => {
        if (state.ok) router.push("/home")
    }, [state.ok, router])

    return (
        <div className="mt-2 w-full">
            <form action={action} className="">
                <div className="relative w-full min-w-[12.5rem]">
                    <textarea
                        id="new-post"
                        name="newPost"
                        className={textAreaStyles}
                        placeholder=" "
                        value={text}
                        onChange={(event) => setText(event.target.value)}
                    ></textarea>
                    <label className={textAreaLabelStyles}>{t("TextAreaLabel")}</label>
                </div>
                <div className="mt-2 flex justify-between">
                    <div className="relative">
                        <button
                            type="button"
                            ref={emojiButtonRef}
                            onClick={handleEmojiPickerToggle}
                            aria-label={t("EmojiPickerLabel")}
                            title={t("EmojiPickerLabel")}
                            className="cursor-pointer rounded-full p-2 text-body-600 hover:bg-background-100"
                        >
                            <HiMiniFaceSmile size={24} />
                        </button>
                        <span
                            className={twMerge(
                                "absolute inset-1/2",
                                !emojiPickerOpen && "hidden"
                            )}
                            ref={emojiPickerRef}
                            aria-hidden={!emojiPickerOpen}
                            aria-live="polite"
                            aria-label={t("EmojiPickerLabel")}
                        >
                            <EmojiPicker
                                onEmojiClick={(emojiData, event) =>
                                    handleEmojiClick(emojiData, event)
                                }
                                width={300}
                                theme={Theme.AUTO}
                                emojiStyle={EmojiStyle.NATIVE}
                                lazyLoadEmojis
                                open={emojiPickerOpen}
                            />
                        </span>
                    </div>
                    <Button
                        type="submit"
                        className="flex-grow-0 px-10 py-2 text-center align-middle font-heading"
                        disabled={pending}
                        aria-disabled={pending}
                    >
                        {pending ? t("NewPostButtonLoading") : t("NewPostButtonSubmit")}
                    </Button>
                </div>
            </form>
        </div>
    )
}
