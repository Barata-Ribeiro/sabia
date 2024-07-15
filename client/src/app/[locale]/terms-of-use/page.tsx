import SecondaryHeader from "@/components/global/secondary-header"
import ReadingIndicator from "@/components/shared/reading-indicator"
import ScrollToTopButton from "@/components/shared/scroll-to-top-button"
import { Metadata } from "next"
import { getTranslations, unstable_setRequestLocale } from "next-intl/server"

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
    const t = await getTranslations({
        locale: params.locale,
        namespace: "TermsOfUse"
    })

    return {
        title: t("TermsTitle"),
        description: t("TermsDescription")
    }
}

export default function TermsOfUsePage({
    params
}: Readonly<{
    params: { locale: string }
}>) {
    unstable_setRequestLocale(params.locale)
    return (
        <main role="main">
            <ReadingIndicator />
            <SecondaryHeader />
            <section className="mx-auto my-6 flex max-w-5xl flex-col gap-6 px-4 sm:px-0"></section>
            <ScrollToTopButton />
        </main>
    )
}
