import { unstable_setRequestLocale } from "next-intl/server"
import { redirect } from "next/navigation"

export default async function DeleteSettingsPage({ params }: { params: { locale: string } }) {
    unstable_setRequestLocale(params.locale)
    return redirect(params.locale + "/settings")
}
