import { notFound } from "next/navigation"

interface NewPostPageProps {
    params: { locale: string; username: string }
}

export async function generateMetadata({ params }: NewPostPageProps) {
    return { title: `New Post - ${params.username}` }
}

export default async function NewPostPage({ params }: NewPostPageProps) {
    if (!params.username) return notFound()

    return (
        <main>
            <h1>NEW POST!</h1>
        </main>
    )
}
