import NewPostModal from "@/components/modal/new-post-modal"
import { unstable_setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"

interface NewPostPageProps {
    params: { locale: string; username: string }
}

export default function NewPostPage({ params }: Readonly<NewPostPageProps>) {
    unstable_setRequestLocale(params.locale)
    if (!params.username) return notFound()

    return <NewPostModal />
}
