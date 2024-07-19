import getUnsplashRandomImage from "@/actions/get-unsplash-random-image"
import LoginForm from "@/components/forms/login-form"
import LoginImage from "@/components/login-image"
import { UnsplashResponse } from "@/interfaces/unplash"
import { Link } from "@/navigation"
import { getTranslations, unstable_setRequestLocale } from "next-intl/server"

export default async function LoginPage({
    params
}: Readonly<{
    params: { locale: string }
}>) {
    unstable_setRequestLocale(params.locale)

    const t = await getTranslations({ locale: params.locale, namespace: "LoginPage" })

    const photoResponse = await getUnsplashRandomImage("Thrush")
    const { photo } = photoResponse as { photo: UnsplashResponse }

    return (
        <main className="shadow-accent-900/5 font-body lg:rounded-b-2xl lg:shadow-xl">
            <section className="flex h-screen flex-col items-center md:flex-row lg:rounded-b-2xl">
                <div className="relative hidden h-screen w-full bg-background-950 md:w-1/2 lg:block lg:rounded-bl-2xl xl:w-2/3">
                    {photo && <LoginImage photo={photo} />}
                </div>

                <div className="flex h-screen w-full items-center justify-center bg-background-100 px-6 md:mx-auto md:w-1/2 md:max-w-md lg:max-w-full lg:rounded-br-2xl lg:px-16 xl:w-1/3 xl:px-12">
                    <div className="h-100 w-full">
                        <h1 className="mt-12 font-heading text-2xl font-bold leading-tight md:text-2xl">
                            {t("PageTitle")}
                        </h1>

                        <LoginForm />

                        <hr className="my-6 w-full border-gray-300" />

                        <p>
                            {t("PageRegisterMessage")}
                            <Link
                                locale={params.locale}
                                href="/auth/register"
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
