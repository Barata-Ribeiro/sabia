import DeleteAccountModal from "@/components/modal/delete-account-modal"
import { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "Delete Account | Sabiá",
        description: "Delete your account. This action is irreversible."
    }
}

export default function DeleteAccountPage() {
    return <DeleteAccountModal />
}
