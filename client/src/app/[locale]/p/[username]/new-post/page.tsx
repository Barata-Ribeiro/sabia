import { redirect } from "@/navigation"
import { notFound } from "next/navigation"

interface NewPostPageProps {
    params: { locale: string; username: string }
}

export default async function NewPostPage({ params }: NewPostPageProps) {
    if (!params.username) return notFound()

    return redirect("/home")
}
