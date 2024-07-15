import getUserContext from "@/actions/user/get-user-context"
import Footer from "@/components/global/footer"
import Header from "@/components/global/header"
import { UserContextProvider } from "@/context/user-context-provider"
import { UserContextResponse } from "@/interfaces/user"
import { locales } from "@/navigation"
import "./globals.css"
import tw from "@/utils/tw"
import { Metadata } from "next"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, getTranslations } from "next-intl/server"
import { Average_Sans, Open_Sans } from "next/font/google"
import { notFound } from "next/navigation"
import { type ReactNode } from "react"

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
    children: Readonly<ReactNode>
    newPostModal: ReactNode
    params: { locale: string }
}

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
    const t = await getTranslations({ locale: params.locale, namespace: "LayoutRoot" })

    return {
        title: {
            default: t("title"),
            template: "%s | " + t("title")
        },
        description: t("description")
    }
}

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }))
}

export default async function RootLayout({
    children,
    newPostModal = null,
    params: { locale }
}: Readonly<LocaleLayoutProps>) {
    if (!locales.includes(locale)) notFound()

    const messages = await getMessages()

    const context = await getUserContext()
    let user: UserContextResponse | null = null
    if (context.ok) user = context.response?.data as UserContextResponse

    const body_styles = tw`flex h-full min-h-dvh flex-col`

    return (
        <html lang={locale} suppressHydrationWarning={true} className="h-full bg-background-50 dark:bg-background-950">
            <NextIntlClientProvider locale={locale} messages={messages}>
                <body className={`${body_styles} ${open_sans.variable} ${avarage_sans.variable}`}>
                    <UserContextProvider user={user}>
                        {user && <Header user={user} />}
                        <div className="flex flex-1 flex-col md:container has-[#new-post,#public-feed-section,#hashtag-section]:overflow-auto">
                            {children}
                        </div>
                        <Footer />
                        {newPostModal}
                    </UserContextProvider>
                </body>
            </NextIntlClientProvider>
        </html>
    )
}
