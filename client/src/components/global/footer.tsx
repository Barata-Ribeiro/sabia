import LocaleSwitcher from "@/components/global/locale-switcher"
import { useLocale, useTranslations } from "next-intl"
import Link from "next/link"

export default function Footer() {
    const t = useTranslations("Footer")
    const localActive = useLocale()

    const links = {
        privacy: "/privacy-policy",
        terms: "/terms-of-use",
        repository: "https://github.com/Barata-Ribeiro/sabia"
    }

    return (
        <footer className="text-body-600 font-body">
            <div className="container mx-auto flex flex-col items-center px-5 py-8 sm:flex-row">
                <Link
                    href="/"
                    className="title-font text-body-900 flex items-center justify-center font-medium md:justify-start"
                >
                    {/* LOGO TO BE ADDED */}
                    <span className="ml-3 text-xl">Sabiá</span>
                </Link>
                <p className="text-body-500 mt-4 text-sm sm:ml-4 sm:mt-0 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:pl-4">
                    © {new Date().getFullYear()} Sabiá —
                    <Link
                        href="https://barataribeiro.com/"
                        className="text-body-600 ml-1"
                        rel="noopener noreferrer"
                        target="_blank"
                        aria-label="Barata-Ribeiro - Portfolio"
                        title="Barata-Ribeiro - Portfolio"
                    >
                        Barata-Ribeiro
                    </Link>
                </p>
                <nav className="-mx-2 mt-4 flex items-center justify-center max-sm:flex-wrap sm:ml-auto sm:mt-0 sm:inline-flex sm:justify-start">
                    {Object.entries(links).map(([key, value]) => (
                        <Link
                            key={key}
                            href={
                                key === "repository" ? value : `/${localActive}${value}`
                            }
                            className="text-body-500 hover:text-body-900 mx-2"
                        >
                            {t(key)}
                        </Link>
                    ))}
                    <LocaleSwitcher />
                </nav>
            </div>
        </footer>
    )
}
