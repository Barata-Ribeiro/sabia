import getUserContext from "@/actions/user/get-user-context"
import EditAccountForm from "@/components/forms/edit-account-form"
import LinkButton from "@/components/shared/link-button"
import { UserContextResponse } from "@/interfaces/user"
import { NULL_AVATAR } from "@/utils/constants"
import getBase64 from "@/utils/get-base64"
import { Metadata } from "next"
import { getLocale, getTranslations } from "next-intl/server"
import { HiExclamationCircle } from "react-icons/hi2"

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("SettingsPage")

    return {
        title: t("PageTitle"),
        description: t("PageDescription")
    }
}

export default async function SettingsPage() {
    const t = await getTranslations("SettingsPage")
    const localeActive = await getLocale()
    const context = await getUserContext()
    const user = context.response?.data as UserContextResponse

    let coverBlur: string | undefined
    if (user.coverImageUrl) {
        coverBlur = await getBase64(user.coverImageUrl, localeActive)
    }

    const avatarBlur = await getBase64(user.avatarImageUrl ?? NULL_AVATAR, localeActive)

    return (
        <section id="settings-section" className="flex w-full flex-col gap-4 border-l px-2 font-body md:pl-4">
            <header>
                <h1 className="pt-6 font-heading text-2xl font-semibold text-body-900 dark:text-body-100">
                    {t("PageTitle")}
                </h1>
                <p className="text-body-900 dark:text-body-100">{t("PageDescription")}</p>
            </header>

            <EditAccountForm user={user} avatarBlur={avatarBlur} coverBlur={coverBlur} />

            <footer>
                <h2 className="py-2 font-heading text-xl font-semibold text-body-900 dark:text-body-100">
                    {t("PageDeleteSectionTitle")}
                </h2>
                <p className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-4 py-1 text-rose-600">
                    <HiExclamationCircle size={22} />
                    {t("PageDeleteWarning")}
                </p>
                <p className="mt-2 max-w-[55ch] text-pretty">{t("PageDeleteParagraph")}</p>
                <LinkButton
                    href="/settings/delete"
                    className="ml-auto font-semibold text-rose-600 underline decoration-2"
                >
                    {t("PageDeleteButton")}
                </LinkButton>
            </footer>
        </section>
    )
}
