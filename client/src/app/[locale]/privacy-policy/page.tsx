import SecondaryHeader from "@/components/global/secondary-header"
import ReadingIndicator from "@/components/shared/reading-indicator"
import ScrollToTopButton from "@/components/shared/scroll-to-top-button"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("PrivacyPolicy")

    return {
        title: `${t("PolicyTitle")} | Sabiá`,
        description: t("PolicyDescription")
    }
}

export default async function PrivacyPolicyPage({
    params
}: {
    params: { locale: string }
}) {
    const t = await getTranslations({
        locale: params.locale,
        namespace: "PrivacyPolicy"
    })

    return (
        <main role="main">
            <ReadingIndicator />
            <SecondaryHeader />
            <section
                className="mx-auto my-6 flex max-w-5xl flex-col gap-6 px-4
            sm:px-0"
            >
                <h1 className="text-center text-4xl font-medium">{t("PolicyTitle")}</h1>

                <p>{t("PolicyLastUpdated")}</p>

                <ul
                    id="screen-reader-navigation"
                    className="sr-only"
                    aria-label="SCREEN READER NAVIGATION"
                    role="privacy policy navigation"
                >
                    <li>
                        <a href="#privacy-start">{t("SectionTitle-0")}</a>
                    </li>
                    <li>
                        <a href="#interpretation-and-definitions">
                            {t("Section-1.title")}
                        </a>
                    </li>
                    <li>
                        <a href="#collecting-using-personal-data">
                            {t("Section-2.title")}
                        </a>
                    </li>
                    <li>
                        <a href="#childrens-privacy">{t("Section-3.title")}</a>
                    </li>
                    <li>
                        <a href="#links-to-other-websites">{t("Section-4.title")}</a>
                    </li>
                    <li>
                        <a href="#change-privacy-policy">{t("Section-5.title")}</a>
                    </li>
                    <li>
                        <a href="#contact-us">{t("Section-6.title")}</a>
                    </li>
                </ul>

                <article id="privacy-start" className="flex flex-col gap-4">
                    <p>{t("PrivacyDescription-1")}</p>
                    <p>{t("PrivacyDescription-2")}</p>
                </article>

                <div
                    id="interpretation-and-definitions"
                    className="flex flex-col gap-4"
                >
                    <h2 className="-mb-2 text-2xl">{t("Section-1.title")}</h2>

                    <article id="interpretation" className="flex flex-col gap-4">
                        <h3 className="-mb-2 text-xl">
                            {t("Section-1.subtitles.SubSectionTitle-1_1")}
                        </h3>
                        <p>{t("Section-1.paragraphs.paragraph-1")}</p>
                    </article>

                    <article id="definitions" className="flex flex-col gap-4">
                        <h3 className="-mb-2 text-xl">
                            {t("Section-1.subtitles.SubSectionTitle-1_2")}
                        </h3>
                        <p>{t("Section-1.paragraphs.paragraph-2")}</p>
                        <ol className="ml-4 flex list-inside list-decimal flex-col gap-2">
                            <li>
                                <strong className="font-bold">
                                    {t("Section-1.list.item-1.term")}
                                </strong>
                                {t("Section-1.list.item-1.definition")}
                            </li>
                            <li>
                                <strong className="font-bold">
                                    {t("Section-1.list.item-2.term")}
                                </strong>
                                {t("Section-1.list.item-2.definition")}
                            </li>
                            <li>
                                <strong className="font-bold">
                                    {t("Section-1.list.item-3.term")}
                                </strong>
                                {t("Section-1.list.item-3.definition")}
                            </li>
                            <li>
                                <strong className="font-bold">
                                    {t("Section-1.list.item-4.term")}
                                </strong>
                                {t("Section-1.list.item-4.definition")}
                            </li>
                            <li>
                                <strong className="font-bold">
                                    {t("Section-1.list.item-5.term")}
                                </strong>
                                {t("Section-1.list.item-5.definition")}
                            </li>
                            <li>
                                <strong className="font-bold">
                                    {t("Section-1.list.item-6.term")}
                                </strong>
                                {t("Section-1.list.item-6.definition")}
                            </li>
                            <li>
                                <strong className="font-bold">
                                    {t("Section-1.list.item-7.term")}
                                </strong>
                                {t("Section-1.list.item-7.definition")}
                            </li>
                            <li>
                                <strong className="font-bold">
                                    {t("Section-1.list.item-8.term")}
                                </strong>
                                {t("Section-1.list.item-8.definition")}
                            </li>
                            <li>
                                <strong className="font-bold">
                                    {t("Section-1.list.item-9.term")}
                                </strong>
                                {t("Section-1.list.item-9.definition")}
                            </li>
                            <li>
                                <strong className="font-bold">
                                    {t("Section-1.list.item-10.term")}
                                </strong>
                                {t("Section-1.list.item-10.definition")}
                            </li>
                            <li>
                                <strong className="font-bold">
                                    {t("Section-1.list.item-11.term")}
                                </strong>
                                {t("Section-1.list.item-11.definition")}
                                <a
                                    href="#"
                                    rel="external nofollow noopener"
                                    target="_blank"
                                >
                                    TO BE ADDED...
                                </a>
                            </li>
                            <li>
                                <strong className="font-bold">
                                    {t("Section-1.list.item-12.term")}
                                </strong>
                                {t("Section-1.list.item-12.definition")}
                            </li>
                        </ol>
                    </article>
                </div>

                <div
                    id="collecting-using-personal-data"
                    className="flex flex-col gap-4"
                >
                    <h2 className="-mb-2 text-2xl">{t("Section-2.title")}</h2>

                    <article
                        id="types-of-data-collected"
                        className="flex flex-col gap-4"
                    >
                        <h3 className="-mb-2 text-xl">
                            {t("Section-2.subtitles.SubSectionTitle-2_1")}
                        </h3>

                        <div className="flex flex-col gap-4">
                            <h4 className="-mb-2 text-lg">
                                {t("Section-2.subtitles.SubSectionTitle-2_1_1")}
                            </h4>
                            <p>{t("Section-2.paragraphs.paragraph-2_1")}</p>
                            <ol className="ml-4 flex list-inside list-decimal flex-col gap-2">
                                <li>{t("Section-2.list.item-2_1_1")}</li>
                                <li>{t("Section-2.list.item-2_1_2")}</li>
                            </ol>
                        </div>

                        <div className="flex flex-col gap-4">
                            <h4 className="-mb-2 text-lg">
                                {t("Section-2.subtitles.SubSectionTitle-2_1_2")}
                            </h4>
                            <p>{t("Section-2.paragraphs.paragraph-2_2")}</p>
                            <p>{t("Section-2.paragraphs.paragraph-2_3")}</p>
                            <p>{t("Section-2.paragraphs.paragraph-2_4")}</p>
                            <p>{t("Section-2.paragraphs.paragraph-2_5")}</p>
                        </div>

                        <div className="flex flex-col gap-4">
                            <h4 className="-mb-2 text-lg">
                                {t("Section-2.subtitles.SubSectionTitle-2_1_3")}
                            </h4>
                            <p>{t("Section-2.paragraphs.paragraph-2_6")}</p>
                            <ol className="ml-4 flex list-inside list-decimal flex-col gap-2">
                                <li>
                                    <strong className="font-bold">
                                        {t("Section-2.list.item-2_3_1.term")}
                                    </strong>
                                    {t("Section-2.list.item-2_3_1.definition")}
                                </li>
                                <li>
                                    <strong className="font-bold">
                                        {t("Section-2.list.item-2_3_2.term")}
                                    </strong>
                                    {t("Section-2.list.item-2_3_2.definition")}
                                </li>
                            </ol>
                            <p>{t("Section-2.paragraphs.paragraph-2_7")}</p>
                            <p>{t("Section-2.paragraphs.paragraph-2_8")}</p>
                            <ol className="ml-4 flex list-inside list-decimal flex-col gap-2">
                                <li>
                                    <strong className="font-bold">
                                        {t("Section-2.list.item-2_4_1.term")}
                                    </strong>
                                    <p>{t("Section-2.list.item-2_4_1.type")}</p>
                                    <p>{t("Section-2.list.item-2_4_1.administered")}</p>
                                    <p>{t("Section-2.list.item-2_4_1.purpose")}</p>
                                </li>
                                <li>
                                    <strong className="font-bold">
                                        {t("Section-2.list.item-2_4_2.term")}
                                    </strong>
                                    <p>{t("Section-2.list.item-2_4_2.type")}</p>
                                    <p>{t("Section-2.list.item-2_4_2.administered")}</p>
                                    <p>{t("Section-2.list.item-2_4_2.purpose")}</p>
                                </li>
                                <li>
                                    <strong className="font-bold">
                                        {t("Section-2.list.item-2_4_3.term")}
                                    </strong>
                                    <p>{t("Section-2.list.item-2_4_3.type")}</p>
                                    <p>{t("Section-2.list.item-2_4_3.administered")}</p>
                                    <p>{t("Section-2.list.item-2_4_3.purpose")}</p>
                                </li>
                            </ol>
                            <p>{t("Section-2.paragraphs.paragraph-2_9")}</p>
                        </div>
                    </article>

                    <article
                        id="use-your-personal-data"
                        className="flex flex-col gap-4"
                    >
                        <h3 className="-mb-2 text-xl">
                            {t("Section-2.subtitles.SubSectionTitle-2_2")}
                        </h3>
                        <p>{t("Section-2.paragraphs.paragraph-2_10")}</p>
                        <ol className="ml-4 flex list-inside list-decimal flex-col gap-2">
                            <li>
                                <strong className="font-bold">
                                    {t("Section-2.list.item-2_5_1.term")}
                                </strong>
                                {t("Section-2.list.item-2_5_1.definition")}
                            </li>
                            <li>
                                <strong className="font-bold">
                                    {t("Section-2.list.item-2_5_2.term")}
                                </strong>
                                {t("Section-2.list.item-2_5_2.definition")}
                            </li>
                            <li>
                                <strong className="font-bold">
                                    {t("Section-2.list.item-2_5_3.term")}
                                </strong>
                                {t("Section-2.list.item-2_5_3.definition")}
                            </li>
                            <li>
                                <strong className="font-bold">
                                    {t("Section-2.list.item-2_5_4.term")}
                                </strong>
                                {t("Section-2.list.item-2_5_4.definition")}
                            </li>
                            <li>
                                <strong className="font-bold">
                                    {t("Section-2.list.item-2_5_5.term")}
                                </strong>
                                {t("Section-2.list.item-2_5_5.definition")}
                            </li>
                            <li>
                                <strong className="font-bold">
                                    {t("Section-2.list.item-2_5_6.term")}
                                </strong>
                                {t("Section-2.list.item-2_5_6.definition")}
                            </li>
                            <li>
                                <strong className="font-bold">
                                    {t("Section-2.list.item-2_5_7.term")}
                                </strong>
                                {t("Section-2.list.item-2_5_7.definition")}
                            </li>
                            <li>
                                <strong className="font-bold">
                                    {t("Section-2.list.item-2_5_8.term")}
                                </strong>
                                {t("Section-2.list.item-2_5_8.definition")}
                            </li>
                        </ol>
                        <p>{t("Section-2.paragraphs.paragraph-2_11")}</p>
                        <ol className="ml-4 flex list-inside list-decimal flex-col gap-2">
                            <li>
                                <strong className="font-bold">
                                    {t("Section-2.list.item-2_6_1.term")}
                                </strong>
                                {t("Section-2.list.item-2_6_1.definition")}
                            </li>
                            <li>
                                <strong className="font-bold">
                                    {t("Section-2.list.item-2_6_2.term")}
                                </strong>
                                {t("Section-2.list.item-2_6_2.definition")}
                            </li>
                            <li>
                                <strong className="font-bold">
                                    {t("Section-2.list.item-2_6_3.term")}
                                </strong>
                                {t("Section-2.list.item-2_6_3.definition")}
                            </li>
                            <li>
                                <strong className="font-bold">
                                    {t("Section-2.list.item-2_6_4.term")}
                                </strong>
                                {t("Section-2.list.item-2_6_4.definition")}
                            </li>
                            <li>
                                <strong className="font-bold">
                                    {t("Section-2.list.item-2_6_5.term")}
                                </strong>
                                {t("Section-2.list.item-2_6_5.definition")}
                            </li>
                            <li>
                                <strong className="font-bold">
                                    {t("Section-2.list.item-2_6_6.term")}
                                </strong>
                                {t("Section-2.list.item-2_6_6.definition")}
                            </li>
                        </ol>
                    </article>

                    <article
                        id="retention-your-personal-data"
                        className="flex flex-col gap-4"
                    >
                        <h3 className="-mb-2 text-xl">
                            {t("Section-2.subtitles.SubSectionTitle-2_3")}
                        </h3>
                        <p>{t("Section-2.paragraphs.paragraph-2_12")}</p>
                        <p>{t("Section-2.paragraphs.paragraph-2_13")}</p>
                    </article>

                    <article
                        id="transfer-your-personal-data"
                        className="flex flex-col gap-4"
                    >
                        <h3 className="-mb-2 text-xl">
                            {t("Section-2.subtitles.SubSectionTitle-2_4")}
                        </h3>
                        <p>{t("Section-2.paragraphs.paragraph-2_14")}</p>
                        <p>{t("Section-2.paragraphs.paragraph-2_15")}</p>
                        <p>{t("Section-2.paragraphs.paragraph-2_16")}</p>
                    </article>

                    <article
                        id="delete-your-personal-data"
                        className="flex flex-col gap-4"
                    >
                        <h3 className="-mb-2 text-xl">
                            {t("Section-2.subtitles.SubSectionTitle-2_5")}
                        </h3>
                        <p>{t("Section-2.paragraphs.paragraph-2_17")}</p>
                        <p>{t("Section-2.paragraphs.paragraph-2_18")}</p>
                        <p>{t("Section-2.paragraphs.paragraph-2_19")}</p>
                        <p>{t("Section-2.paragraphs.paragraph-2_20")}</p>
                    </article>

                    <article
                        id="disclosure-your-personal-data"
                        className="flex flex-col gap-4"
                    >
                        <h3 className="-mb-2 text-xl">
                            {t("Section-2.subtitles.SubSectionTitle-2_6")}
                        </h3>

                        <div className="flex flex-col gap-4">
                            <h4 className="-mb-2 text-lg">
                                {t("Section-2.subtitles.SubSectionTitle-2_6_1")}
                            </h4>
                            <p>{t("Section-2.paragraphs.paragraph-2_21")}</p>
                            <h4 className="-mb-2 text-lg">
                                {t("Section-2.subtitles.SubSectionTitle-2_6_2")}
                            </h4>
                            <p>{t("Section-2.paragraphs.paragraph-2_22")}</p>
                        </div>

                        <div className="flex flex-col gap-4">
                            <h4 className="-mb-2 text-lg">
                                {t("Section-2.subtitles.SubSectionTitle-2_6_3")}
                            </h4>
                            <p>{t("Section-2.paragraphs.paragraph-2_23")}</p>
                            <ol className="ml-4 flex list-inside list-decimal flex-col gap-2">
                                <li>{t("Section-2.list.item-2_7_1")}</li>
                                <li>{t("Section-2.list.item-2_7_2")}</li>
                                <li>{t("Section-2.list.item-2_7_3")}</li>
                                <li>{t("Section-2.list.item-2_7_4")}</li>
                                <li>{t("Section-2.list.item-2_7_5")}</li>
                            </ol>
                        </div>
                    </article>

                    <article
                        id="security-your-personal-data"
                        className="flex flex-col gap-4"
                    >
                        <h3 className="-mb-2 text-xl">
                            {t("Section-2.subtitles.SubSectionTitle-2_7")}
                        </h3>
                        <p>{t("Section-2.paragraphs.paragraph-2_24")}</p>
                    </article>
                </div>

                <div id="childrens-privacy" className="flex flex-col gap-4">
                    <h2 className="-mb-2 text-2xl">{t("Section-3.title")}</h2>
                    <article className="flex flex-col gap-4">
                        <p>{t("Section-3.paragraphs.paragraph-1")}</p>
                        <p>{t("Section-3.paragraphs.paragraph-2")}</p>

                        <strong className="font-bold">
                            {t("Section-3.paragraphs.paragraph-3")}
                        </strong>
                    </article>
                </div>

                <div id="links-to-other-websites" className="flex flex-col gap-4">
                    <h2 className="-mb-2 text-2xl">{t("Section-4.title")}</h2>
                    <article className="flex flex-col gap-4">
                        <p>{t("Section-4.paragraphs.paragraph-1")}</p>
                        <p>{t("Section-4.paragraphs.paragraph-2")}</p>
                    </article>
                </div>

                <div id="change-privacy-policy" className="flex flex-col gap-4">
                    <h2 className="-mb-2 text-2xl">{t("Section-5.title")}</h2>
                    <article className="flex flex-col gap-4">
                        <p>{t("Section-5.paragraphs.paragraph-1")}</p>
                        <p>{t("Section-5.paragraphs.paragraph-2")}</p>
                        <p>{t("Section-5.paragraphs.paragraph-3")}</p>
                    </article>
                </div>

                <div id="contact-us" className="flex flex-col gap-4">
                    <h2 className="-mb-2 text-2xl">{t("Section-6.title")}</h2>
                    <article className="flex flex-col gap-4">
                        <p>{t("Section-6.paragraphs.paragraph")}</p>
                        <ol className="ml-4 flex list-inside list-decimal flex-col gap-2">
                            <li>
                                {t("Section-6.list.item-1.term")}
                                <a
                                    href="#"
                                    rel="external nofollow noopener"
                                    target="_blank"
                                >
                                    {t("Section-6.list.item-1.link")}
                                </a>
                            </li>
                        </ol>
                    </article>
                </div>

                <a className="sr-only" href="#screen-reader-navigation">
                    {t("GoBackScreenReader")}
                </a>
            </section>
            <ScrollToTopButton />
        </main>
    )
}
