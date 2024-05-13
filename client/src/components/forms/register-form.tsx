import Button from "@/components/shared/button"
import Input from "@/components/shared/input"
import { useLocale, useTranslations } from "next-intl"
import Link from "next/link"
import { FaCircleExclamation } from "react-icons/fa6"

export default function RegisterForm() {
    const t = useTranslations("RegisterForm")
    const localActive = useLocale()

    return (
        <form className="space-y-6" action="#">
            <h1 className="font-heading text-2xl leading-6">{t("Title")}</h1>

            <Input
                label={t("InputUsername")}
                name="username"
                className="px-3 py-2.5 pr-9"
                required
                aria-required
            />
            <Input
                label={t("InputDisplayName")}
                name="displayName"
                className="px-3 py-2.5 pr-9"
                required
                aria-required
            />
            <fieldset className="flex items-center gap-2">
                <Input
                    label={t("InputFirstName")}
                    name="firstName"
                    className="px-3 py-2.5 pr-9"
                    required
                    aria-required
                />
                <Input
                    label={t("InputLastName")}
                    name="lastName"
                    className="px-3 py-2.5 pr-9"
                    required
                    aria-required
                />
            </fieldset>
            <Input
                label={t("InputBirthDate")}
                name="birthDate"
                type="date"
                className="px-3 py-2.5 pr-9"
                required
                aria-required
            />
            <Input
                label={t("InputEmail")}
                name="email"
                type="email"
                className="px-3 py-2.5 pr-9"
                required
                aria-required
            />
            <fieldset className="flex flex-col gap-1">
                <div className="flex w-fit items-start gap-2">
                    <Input
                        label={t("InputPassword")}
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        className="px-3 py-2.5 pr-9"
                        required
                        aria-required
                    />
                    <Input
                        label={t("InputConfirmPassword")}
                        name="confirmPassword"
                        type="password"
                        autoComplete="off"
                        className="px-3 py-2.5 pr-9"
                        required
                        aria-required
                    />
                </div>
                <p className="flex w-fit items-center gap-1 self-center text-sm font-normal leading-normal text-primary-700 antialiased">
                    <FaCircleExclamation size={14} />
                    <span className="w-[55ch]">{t("PasswordRequirements")}</span>
                </p>
            </fieldset>

            <div className="flex items-center justify-start gap-2">
                <input
                    className="form-checkbox h-4 w-4 rounded border-body-300 bg-body-100 text-accent-600 focus:ring-2 focus:ring-accent-500 dark:border-body-600 dark:bg-body-700 dark:ring-offset-body-800 dark:focus:ring-accent-600"
                    type="checkbox"
                    name="terms-of-use"
                    id="terms-of-use"
                    required
                    aria-required
                />{" "}
                <label
                    htmlFor="terms-of-use"
                    className="text-left text-body-600 dark:text-body-50 lg:text-body-950"
                >
                    {t("TermsMessage")}
                    <Link
                        href={"/" + localActive + "/terms-of-use"}
                        className="font-heading text-body-600 transition-colors duration-300 hover:text-accent-500 hover:underline dark:text-body-400 dark:hover:text-accent-200"
                    >
                        {t("TermsLink")}
                    </Link>
                    .
                </label>
            </div>
            <Button type="submit" className="py-2">
                {t("RegisterButton")}
            </Button>
        </form>
    )
}
