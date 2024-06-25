"use client"

import postNewReply from "@/actions/post/post-new-reply"
import Button from "@/components/shared/button"
import { PostResponse } from "@/interfaces/post"
import { useRouter } from "@/navigation"
import tw from "@/utils/tw"
import { type EmojiClickData, EmojiStyle } from "emoji-picker-react"
import { useTranslations } from "next-intl"
import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { useFormState, useFormStatus } from "react-dom"

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false })

export default function ReplyPostForm({ postId }: Readonly<{ postId: string }>) {
    const t = useTranslations("ReplyPostForm")
    const router = useRouter()

    const [text, setText] = useState("")

    function handleEmojiClick(emojiData: EmojiClickData) {
        let sym = emojiData.emoji
        setText((prevText) => prevText + sym)
    }

    const textAreaStyles = tw`peer h-full min-h-[6.25rem] w-full !resize-none rounded-[0.438rem] border border-background-200 border-t-transparent bg-transparent px-3 py-2.5 text-body-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-background-200 placeholder-shown:border-t-background-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-background-50`

    const textAreaLabelStyles = tw`before:content[' '] after:content[' pointer-events-none absolute -top-1.5 left-0 flex h-full w-full select-none text-[0.688rem] font-normal leading-tight text-body-400 transition-all before:pointer-events-none before:mr-1 before:mt-[0.406rem] before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-l before:border-t before:border-background-200 before:transition-all after:pointer-events-none after:ml-1 after:mt-[0.406rem] after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-r after:border-t after:border-background-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-body-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[0.688rem] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-l-2 peer-focus:before:border-t-2 peer-focus:before:!border-gray-900 peer-focus:after:border-r-2 peer-focus:after:border-t-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-body-500`

    const { pending } = useFormStatus()
    const [state, action] = useFormState(postNewReply, {
        ok: false,
        clientError: null,
        response: null
    })

    useEffect(() => {
        if (state.ok) {
            const postResponse = state.response?.data as PostResponse
            router.push(
                "/" + postResponse.author.username + "/status/" + postResponse.id
            )
            router.refresh()
        }
    }, [state.ok, router, state.response?.data])

    return (
        <form action={action}>
            <div className="relative w-[32rem]">
                <div className="relative w-full min-w-[200px]">
                    <input type="hidden" name="postId" value={postId} />
                    <textarea
                        id="reply-post"
                        name="replyText"
                        rows={8}
                        aria-label={t("TextAreaLabel")}
                        className={textAreaStyles}
                        placeholder=" "
                        value={text}
                        onChange={(event) => setText(event.target.value)}
                    ></textarea>
                    <label className={textAreaLabelStyles}>{t("TextAreaLabel")}</label>
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
                        disabled={pending}
                        aria-disabled={pending}
                    >
                        {pending
                            ? t("ReplyPostButtonLoading")
                            : t("ReplyPostButtonSubmit")}
                    </Button>
                </div>
            </div>
        </form>
    )
}
