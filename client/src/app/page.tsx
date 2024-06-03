import { getLocale } from "next-intl/server"
import { redirect } from "next/navigation"

export default function RootPage() {
    const locale = getLocale()
    redirect("/" + locale)
}
