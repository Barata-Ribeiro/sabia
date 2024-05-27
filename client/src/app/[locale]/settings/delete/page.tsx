import DeleteAccountForm from "@/components/forms/delete-account-form"
import { Metadata } from "next"
import { HiOutlineExclamationCircle } from "react-icons/hi2"

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "Delete Account | Sabiá",
        description: "Delete your account permanently"
    }
}

export default function DeleteAccountPage() {
    return (
        <section
            id="delete-account-section"
            className="flex w-full flex-col gap-24 border-l px-2 font-body md:pl-4"
        >
            <header>
                <h1 className="pt-6 font-heading text-2xl font-semibold text-body-900 dark:text-body-100">
                    Delete Account
                </h1>
                <p className="text-body-900 dark:text-body-100">
                    Proceed with caution. Deleting your account is irreversible.
                </p>
            </header>
            <article className="flex w-full flex-col items-center justify-center gap-4">
                <h2 className="flex flex-col items-center justify-center gap-2">
                    <HiOutlineExclamationCircle size={50} className="text-red-600" />
                    <span className="text-center font-heading text-xl font-semibold">
                        Your account will be deleted permanently!
                    </span>
                </h2>
                <p className="max-w-[80ch] text-pretty leading-6">
                    Per our terms of service, when you delete your account, all your
                    data will be permanently erased, and there will be no way to recover
                    it. This action is irreversible and final. The reason for complete
                    data deletion is to ensure the privacy and security of your account
                    and our platform. If you are sure you want to delete your account,
                    type your username below followed by the word &rdquo;
                    <strong>-DELETE</strong>&ldquo; to confirm.
                </p>
                <DeleteAccountForm />
            </article>
        </section>
    )
}
