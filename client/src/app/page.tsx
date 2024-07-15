import { redirect } from "next/navigation"

export default async function RootPage({ params }: { params: { locale: string } }) {
    redirect("/" + params.locale)
}
