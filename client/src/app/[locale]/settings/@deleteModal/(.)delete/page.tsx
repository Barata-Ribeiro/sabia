import DeleteAccountModal from "@/components/modal/delete-account-modal"
import { Metadata } from "next"
import { getTranslations, unstable_setRequestLocale } from "next-intl/server"

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
    const t = await getTranslations({
        locale: params.locale,
        namespace: "DeleteAccountTitle"
    })
    return {
        title: t("DeleteAccountTitle"),
        description: t("DeleteAccountDescription")
    }
}

export default function DeleteAccountPage({
    params
}: Readonly<{
    params: { locale: string }
}>) {
    unstable_setRequestLocale(params.locale)
    return <DeleteAccountModal />
}
