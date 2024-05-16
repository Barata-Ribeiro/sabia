import LoginForm from "@/components/forms/login-form"
import { useLocale, useTranslations } from "next-intl"
import Image from "next/image"
import Link from "next/link"

export default function LoginPage() {
    const t = useTranslations("LoginPage")
    const localActive = useLocale()

    return (
        <main className="shadow-accent-900/5 font-body lg:rounded-b-2xl lg:shadow-xl">
            <section className=" flex h-screen flex-col items-center md:flex-row lg:rounded-b-2xl">
                <div className="relative hidden h-screen w-full bg-background-950 md:w-1/2 lg:block lg:rounded-bl-2xl xl:w-2/3">
                    <Image
                        src="https://source.unsplash.com/random/?Thrush"
                        alt={t("PageImageDescription")}
                        title={t("PageImageDescription")}
                        className="h-auto w-auto object-cover lg:rounded-bl-2xl"
                        sizes="100%"
                        fill
                        priority
                    />
                </div>

                <div
                    className="flex h-screen w-full items-center justify-center bg-background-100 px-6 md:mx-auto md:w-1/2 md:max-w-md lg:max-w-full
        lg:rounded-br-2xl lg:px-16 xl:w-1/3 xl:px-12"
                >
                    <div className="h-100 w-full">
                        <h1 className="mt-12 font-heading text-2xl font-bold leading-tight md:text-2xl">
                            {t("PageTitle")}
                        </h1>

                        <LoginForm />

                        <hr className="my-6 w-full border-gray-300" />

                        <p>
                            {t("PageRegisterMessage")}
                            <Link
                                href={localActive + "/auth/register"}
                                className="font-semibold text-primary-600 transition-colors duration-300 hover:text-secondary-500"
                            >
                                {t("PageRegisterLink")}
                            </Link>
                        </p>
                    </div>
                </div>
            </section>
        </main>
    )
}
