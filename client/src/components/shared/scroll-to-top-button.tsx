"use client"

import { HiMiniBarsArrowUp } from "react-icons/hi2"

export default function ScrollToTopButton() {
    return (
        <button
            className="fixed bottom-4 right-4 z-50 animate-bounce rounded-full bg-accent-500 p-2 text-body-900 opacity-50 shadow-md hover:animate-none hover:opacity-100"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
            <HiMiniBarsArrowUp size={24} />
        </button>
    )
}
