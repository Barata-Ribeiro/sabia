import { locales } from "@/navigation"
import "./globals.css"
import tw from "@/utils/tw"
import { Metadata } from "next"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, getTranslations } from "next-intl/server"
import { Average_Sans, Open_Sans } from "next/font/google"
import { notFound } from "next/navigation"
import type { ReactNode } from "react"

const open_sans = Open_Sans({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-open-sans"
})

const avarage_sans = Average_Sans({
    weight: "400",
    subsets: ["latin"],
    display: "swap",
    variable: "--font-average-sans"
})

interface LocaleLayoutProps {
    children: ReactNode
    params: { locale: string }
}

export async function generateMetadata({
    params
}: {
    params: { locale: string }
}): Promise<Metadata> {
    const t = await getTranslations({ locale: params.locale, namespace: "LayoutRoot" })

    return {
        title: t("title"),
        description: t("description")
    }
}

export default async function RootLayout({
    children,
    params: { locale }
}: Readonly<LocaleLayoutProps>) {
    if (!locales.includes(locale)) notFound()

    const messages = await getMessages()

    const body_styles = tw`flex min-h-dvh flex-col`

    return (
        <html lang={locale} suppressHydrationWarning>
            <NextIntlClientProvider locale={locale} messages={messages}>
                <body
                    className={`${body_styles} ${open_sans.variable} ${avarage_sans.variable}`}
                >
                    <div className="flex-1 md:container">{children}</div>
                </body>
            </NextIntlClientProvider>
        </html>
    )
}
