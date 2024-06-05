import ReplyPostModal from "@/components/modal/reply-post-modal"

interface ReplyPostPageProps {
    params: { username: string; id: string }
}

export default function ReplyPostPage({ params }: ReplyPostPageProps) {
    return <ReplyPostModal postId={params.id} />
}
