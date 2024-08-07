"use client"

import login from "@/actions/auth/login"
import Button from "@/components/shared/button"
import Input from "@/components/shared/input"
import { useForm } from "@/hooks/useForm"
import { Link, useRouter } from "@/navigation"
import { useLocale, useTranslations } from "next-intl"
import { useEffect } from "react"
import { FaLock } from "react-icons/fa"
import { FaCircleUser } from "react-icons/fa6"

export default function LoginForm() {
    const t = useTranslations("LoginForm")
    const localActive = useLocale()
    const router = useRouter()

    const { isPending, formState, formAction, onSubmit } = useForm(login, {
        ok: false,
        clientError: null,
        response: null
    })

    useEffect(() => {
        if (formState.ok) router.push("/home")
    }, [formState, router])

    return (
        <form className="mt-6 space-y-6" action={formAction} onSubmit={onSubmit}>
            <Input
                label={t("InputUsername")}
                icon={<FaCircleUser size={20} />}
                name="username"
                autoComplete="username"
                className="px-3 py-2.5 !pr-9"
                required
                aria-required
            />

            <div>
                <Input
                    type="password"
                    label={t("InputPassword")}
                    icon={<FaLock size={20} />}
                    name="password"
                    autoComplete="current-password"
                    className="px-3 py-2.5 !pr-9"
                    required
                    aria-required
                />

                <div className="text-right">
                    {" "}
                    <Link
                        locale={localActive}
                        href={"/auth/password-lost"}
                        className="text-body-600 transition-colors duration-300 hover:text-accent-500 hover:underline dark:text-body-400 dark:hover:text-accent-200"
                    >
                        {t("ForgotPassword")}
                    </Link>
                </div>
            </div>
            <div className="mb-4 mt-1 flex gap-8">
                <Button type="submit" className="py-2" disabled={isPending} aria-disabled={isPending}>
                    {isPending ? t("LoginButtonLoading") : t("LoginButton")}
                </Button>

                <div className="flex max-w-fit items-center gap-2">
                    <input
                        className="form-checkbox h-4 w-4 rounded border-body-300 bg-body-100 text-accent-600 focus:ring-2 focus:ring-accent-500 dark:border-body-600 dark:bg-body-700 dark:ring-offset-body-800 dark:focus:ring-accent-600"
                        type="checkbox"
                        name="remember-me"
                        id="remember-me"
                    />

                    <label htmlFor="remember-me" className="text-left text-body-600 dark:text-body-50 lg:text-body-950">
                        {t("RememberMe")}
                    </label>
                </div>
            </div>
        </form>
    )
}
