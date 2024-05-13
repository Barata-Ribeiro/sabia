// @flow
import RegisterForm from "@/components/forms/register-form"
import { useTranslations } from "next-intl"
import Image from "next/image"
import Link from "next/link"

export default function RegisterPage() {
    const t = useTranslations("RegisterPage")

    return (
        <section className="flex flex-col items-center gap-24 px-6 md:flex-row">
            {/* Left side - form */}
            <div className="w-full">
                <RegisterForm />
                <hr className="my-6 w-full border-gray-300" />

                <p>
                    {t("PageLoginMessage")}
                    <Link
                        href="/"
                        className="font-semibold text-primary-600 transition-colors duration-300 hover:text-secondary-500"
                    >
                        {t("PageLoginLink")}
                    </Link>
                </p>
            </div>

            {/* Right side - illustration */}
            <Image
                src="/undraw_quick_chat_re_bit5.svg"
                alt={t("IllutrationDescription")}
                title={t("IllutrationDescription")}
                className="max-h-72 w-fit object-center italic"
                width={864}
                height={365}
                sizes="100vw"
                priority
            />
        </section>
    )
}
