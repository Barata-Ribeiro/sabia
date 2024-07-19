import { unstable_setRequestLocale } from "next-intl/server"
import { notFound, redirect } from "next/navigation"

interface NewPostPageProps {
    params: { locale: string; username: string }
}

export default async function NewPostPage({ params }: NewPostPageProps) {
    unstable_setRequestLocale(params.locale)
    if (!params.username) return notFound()

    return redirect("/" + params.locale + "/home")
}
