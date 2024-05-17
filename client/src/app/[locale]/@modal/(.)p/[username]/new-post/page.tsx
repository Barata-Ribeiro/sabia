import NewPostModal from "@/components/modal/NewPostModal"
import { notFound } from "next/navigation"

interface NewPostPageProps {
    params: { locale: string; username: string }
}

export async function generateMetadata({ params }: NewPostPageProps) {
    return { title: `New Post - ${params.username}` }
}

export default function NewPostPage({ params }: NewPostPageProps) {
    if (!params.username) return notFound()

    return (
        <div>
            <NewPostModal />
        </div>
    )
}
