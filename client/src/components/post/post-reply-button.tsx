"use client"

import LinkButton from "@/components/shared/link-button"
import { PostResponse } from "@/interfaces/post"
import { HiOutlineChatBubbleOvalLeft } from "react-icons/hi2"

interface PostReplyButtonProps {
    post: PostResponse
    displayNumber?: boolean
}

export default function PostReplyButton({
    post,
    displayNumber = true
}: PostReplyButtonProps) {
    return (
        <div
            id="post-reply"
            className="flex w-max items-center gap-2"
            title="Reply"
            aria-label="Reply Count"
        >
            <LinkButton
                href={"/" + post.author.username + "/status/" + post.id + "/reply"}
            >
                <HiOutlineChatBubbleOvalLeft size={24} aria-hidden="true" />
            </LinkButton>
            {displayNumber && <p aria-label="Reply Count">{post.reply_count}</p>}
        </div>
    )
}
