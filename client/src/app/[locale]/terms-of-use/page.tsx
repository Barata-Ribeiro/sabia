import SecondaryHeader from "@/components/global/secondary-header"
import ReadingIndicator from "@/components/shared/reading-indicator"
import ScrollToTopButton from "@/components/shared/scroll-to-top-button"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("TermsOfUse")

    return {
        title: `${t("TermsTitle")} | Sabiá`,
        description: t("TermsDescription")
    }
}

export default function TermsOfUsePage() {
    return (
        <main role="main">
            <ReadingIndicator />
            <SecondaryHeader />
            <section
                className="mx-auto my-6 flex max-w-5xl flex-col gap-6 px-4
            sm:px-0"
            ></section>
            <ScrollToTopButton />
        </main>
    )
}
