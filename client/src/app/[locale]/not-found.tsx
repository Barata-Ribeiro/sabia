import LinkButton from "@/components/shared/link-button"
import { Metadata } from "next"
import Image from "next/image"
import NotFoundImage from "../../../public/assets/undraw_page_not_found_re_e9o6.svg"

export const metadata: Metadata = {
    title: "404 | Sabiá",
    description:
        "Sorry, we can't find that page. You'll find lots to explore on the home page."
}

export default function NotFound() {
    return (
        <section className="shadow-accent-900/5 bg-white font-body lg:rounded-b-2xl lg:shadow-xl">
            <div className="container mx-auto min-h-screen px-6 py-12 lg:flex lg:items-center lg:gap-12">
                <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
                    <div className="mx-auto max-w-screen-sm text-center">
                        <h1 className="mb-4 text-7xl font-extrabold tracking-tight text-primary-600 dark:text-primary-500 lg:text-9xl">
                            404
                        </h1>
                        <p className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white md:text-4xl">
                            Something&apos;s missing.
                        </p>
                        <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
                            Sorry, we can&apos;t find that page. You&apos;ll find lots
                            to explore on the home page.{" "}
                        </p>
                        <LinkButton
                            href="/"
                            className="my-4 inline-flex select-none rounded-full bg-accent-500 px-5 py-2.5 text-center align-middle font-heading
                            font-medium text-body-900 antialiased transition-all hover:bg-accent-600 focus:outline-none
                            focus:ring-4 focus:ring-primary-300 active:bg-accent-700 dark:focus:ring-primary-900"
                        >
                            Back to Homepage
                        </LinkButton>
                    </div>
                </div>

                <div className="relative mt-8 w-full lg:mt-0 lg:w-1/2">
                    <Image
                        src={NotFoundImage}
                        style={{
                            width: "100%",
                            height: "auto"
                        }}
                        alt="Not found"
                        sizes="100vw"
                        priority
                    />
                </div>
            </div>
        </section>
    )
}
