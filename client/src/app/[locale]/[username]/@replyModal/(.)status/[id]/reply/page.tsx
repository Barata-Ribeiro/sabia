import ReplyPostModal from "@/components/modal/reply-post-modal"
import { unstable_setRequestLocale } from "next-intl/server"

interface ReplyPostPageProps {
    params: { locale: string; username: string; id: string }
}

export default function ReplyPostPage({ params }: Readonly<ReplyPostPageProps>) {
    unstable_setRequestLocale(params.locale)
    return <ReplyPostModal postId={params.id} />
}
