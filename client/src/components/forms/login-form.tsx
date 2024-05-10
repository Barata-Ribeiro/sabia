import Button from "@/components/shared/button"
import Input from "@/components/shared/input"
import { useLocale, useTranslations } from "next-intl"
import Link from "next/link"
import { FaLock } from "react-icons/fa"
import { FaCircleUser } from "react-icons/fa6"

export default function LoginForm() {
    const t = useTranslations("LoginForm")
    const localActive = useLocale()

    return (
        <form className="mt-6 space-y-6" action="">
            <div className="relative">
                <div className="absolute left-2.5 top-1/2 inline-flex h-auto w-auto items-center justify-center text-body-400">
                    <FaCircleUser size={22} />
                </div>

                <Input
                    label={t("InputUsername")}
                    name="username"
                    autoComplete="username"
                    className="rounded-lg py-2 pl-10 pr-4"
                    required
                    aria-required
                />
            </div>

            <div className="relative">
                <div className="absolute left-2.5 top-8 inline-flex h-auto w-auto items-center justify-center text-body-400">
                    <FaLock size={22} />
                </div>

                <>
                    <Input
                        type="password"
                        label={t("InputPassword")}
                        name="password"
                        autoComplete="current-password"
                        className="rounded-lg py-2 pl-10 pr-4"
                        required
                        aria-required
                    />

                    <div className="text-right">
                        {" "}
                        <Link
                            href={localActive + "/auth/password-lost"}
                            className="text-body-600 transition-colors duration-300 hover:text-accent-500 hover:underline dark:text-body-400 dark:hover:text-accent-200"
                        >
                            {t("ForgotPassword")}
                        </Link>
                    </div>
                </>
            </div>
            <div className="mb-4 mt-1 flex gap-8">
                <Button
                    type="submit"
                    className="w-full rounded-lg bg-primary-600 py-2 text-body-50 ring-inset ring-primary-600 transition-all hover:bg-primary-300 hover:text-body-600 hover:ring-2"
                >
                    {t("LoginButton")}
                </Button>

                <div className="flex max-w-fit items-center gap-2">
                    <input
                        className="h-4 w-4 rounded border-body-300 bg-body-100 text-accent-600 focus:ring-2 focus:ring-accent-500 dark:border-body-600 dark:bg-body-700 dark:ring-offset-body-800 dark:focus:ring-accent-600"
                        type="checkbox"
                        name="remember-me"
                        id="remember-me"
                    />

                    <label
                        htmlFor="remember-me"
                        className="text-left text-body-950 dark:text-body-50 lg:text-body-950"
                    >
                        {t("RememberMe")}
                    </label>
                </div>
            </div>
        </form>
    )
}
