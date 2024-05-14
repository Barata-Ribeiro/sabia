import LocaleSwitcherSelect from "@/components/global/locale-switcher-selector"
import { useLocale, useTranslations } from "next-intl"

export default function LocaleSwitcher() {
    const t = useTranslations("LocaleSwitcher")
    const locale = useLocale()

    return (
        <LocaleSwitcherSelect defaultValue={locale}>
            <option value="" disabled>
                {t("SelectLanguage")}
            </option>
            <option value="en">{t("OptionEnglish")}</option>
            <option value="pt-BR">{t("OptionPortuguese")}</option>
        </LocaleSwitcherSelect>
    )
}
