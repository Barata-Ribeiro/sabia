import LinkButton from "@/components/shared/link-button"
import Loading from "@/components/shared/loading"
import tw from "@/utils/tw"
import { HiExclamationCircle } from "react-icons/hi2"

export default async function SettingsLoading() {
    const loadingContainerStyle = tw`w-full animate-pulse space-y-4`
    const loadingElementStyle = tw`h-10 rounded bg-background-200`

    return (
        <section
            id="settings-section"
            className="flex w-full flex-col gap-4 border-l px-2 font-body md:pl-4"
        >
            <header>
                <h1 className="pt-6 font-heading text-2xl font-semibold text-body-900 dark:text-body-100">
                    Account Settings
                </h1>
                <p className="text-body-900 dark:text-body-100">
                    Update your account settings.
                </p>
            </header>

            <form action="">
                <fieldset className="mb-6 flex flex-col gap-6 rounded-lg border p-4 transition-colors hover:bg-background-100">
                    <legend className="px-2 font-heading text-sm text-body-900 antialiased dark:text-body-100">
                        Account Information
                    </legend>
                    <div className={loadingContainerStyle}>
                        <div className={loadingElementStyle}></div>
                        <div className={loadingElementStyle}></div>
                        <div className={loadingElementStyle}></div>
                    </div>
                </fieldset>
                <fieldset className="mb-6 flex flex-col gap-6 rounded-lg border p-4 transition-colors hover:bg-background-100">
                    <legend className="px-2 font-heading text-sm text-body-900 antialiased dark:text-body-100">
                        Personal Information
                    </legend>
                    <div className={loadingContainerStyle}>
                        <div className={loadingElementStyle}></div>
                        <div className={loadingElementStyle}></div>
                        <div className={loadingElementStyle}></div>
                    </div>
                </fieldset>
                <fieldset className="mb-6 flex flex-col gap-6 rounded-lg border p-4 transition-colors hover:bg-background-100">
                    <legend className="px-2 font-heading text-sm text-body-900 antialiased dark:text-body-100">
                        Public Information
                    </legend>
                    <div className={loadingContainerStyle}>
                        <div className={loadingElementStyle}></div>
                        <div className={loadingElementStyle}></div>
                        <div className={loadingElementStyle}></div>
                    </div>
                </fieldset>
                <fieldset className="mb-6 flex flex-col gap-6 rounded-lg border p-4 transition-colors hover:bg-background-100">
                    <legend className="px-2 font-heading text-sm text-body-900 antialiased dark:text-body-100">
                        Security Information
                    </legend>
                    <div className={loadingContainerStyle}>
                        <div className={loadingElementStyle}></div>
                        <div className={loadingElementStyle}></div>
                    </div>
                </fieldset>
                <div className="flex flex-col gap-6 self-center">
                    <div className={loadingContainerStyle}>
                        <div className={loadingElementStyle}></div>
                    </div>
                    <div className={loadingContainerStyle}>
                        <div className={loadingElementStyle}></div>
                    </div>
                    <div className={loadingContainerStyle}>
                        <div className={loadingElementStyle}></div>
                    </div>
                    <div className="flex items-center justify-center">
                        <Loading />
                    </div>
                </div>
            </form>

            <footer>
                <h2 className="py-2 font-heading text-xl font-semibold text-body-900 dark:text-body-100">
                    Delete Account
                </h2>
                <p className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-4 py-1 text-rose-600">
                    <HiExclamationCircle size={22} />
                    Proceed with caution
                </p>
                <p className="mt-2 max-w-[55ch] text-pretty">
                    Please ensure you have backed up all your account data before
                    proceeding. Once you delete your account, all your data will be
                    permanently erased, and there will be no way to recover it. This
                    action is irreversible and final.
                </p>
                <LinkButton
                    href="/settings/delete"
                    className="ml-auto font-semibold text-rose-600 underline decoration-2"
                >
                    Continue with deletion
                </LinkButton>
            </footer>
        </section>
    )
}
