import LocaleSwitcher from "@/components/global/locale-switcher"
import { Link } from "@/navigation"
import { useLocale, useTranslations } from "next-intl"
import Image from "next/image"

export default function Footer() {
    const t = useTranslations("Footer")
    const localActive = useLocale()

    const links = {
        privacy: "/privacy-policy",
        terms: "/terms-of-use",
        repository: "https://github.com/Barata-Ribeiro/sabia"
    }

    return (
        <footer className="font-body text-body-600">
            <div className="container mx-auto flex flex-col items-center px-5 py-8 sm:flex-row">
                <Link locale={localActive} href="/">
                    <Image
                        src="/assets/logo.svg"
                        alt="Sabiá - Logo"
                        title="Sabiá - Logo"
                        className="ml-3 h-auto w-32 sm:w-40"
                        width={512}
                        height={105}
                        sizes="100vw"
                    />
                </Link>
                <p className="mt-4 text-sm text-body-500 sm:ml-4 sm:mt-0 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:pl-4">
                    © {new Date().getFullYear()} Sabiá —
                    <Link
                        href="https://barataribeiro.com/"
                        className="ml-1 text-body-600"
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
                            locale={localActive}
                            href={value}
                            rel={key === "repository" ? "noopener noreferrer" : ""}
                            target={key === "repository" ? "_blank" : ""}
                            className="mx-2 text-body-500 hover:text-body-900"
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
