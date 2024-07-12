import DeleteAccountModal from "@/components/modal/delete-account-modal"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("DeleteAccountTitle")
    return {
        title: t("DeleteAccountTitle"),
        description: t("DeleteAccountDescription")
    }
}

export default function DeleteAccountPage() {
    return <DeleteAccountModal />
}
