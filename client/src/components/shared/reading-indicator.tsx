"use client"

import { useEffect, useRef } from "react"

export default function ReadingIndicator() {
    const barRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const progressBar = barRef.current

        const calculateScrollDistance = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const docHeight =
                document.body.scrollHeight || document.documentElement.scrollHeight
            const winHeight =
                window.innerHeight || document.documentElement.clientHeight
            const scrollPercent = scrollTop / (docHeight - winHeight)

            return scrollPercent * 100
        }

        const updateProgressBar = () => {
            const scrollDistance = calculateScrollDistance()

            if (progressBar) {
                progressBar.style.width = scrollDistance + "%"
                progressBar.setAttribute("aria-valuenow", scrollDistance.toString())
            }
        }

        window.addEventListener("scroll", updateProgressBar)

        return () => window.removeEventListener("scroll", updateProgressBar)
    }, [])

    return (
        <div className="fixed left-0 top-0 h-2 w-full bg-background-100">
            <div
                ref={barRef}
                style={{ width: 0 }}
                className="h-full bg-accent-500"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
            ></div>
        </div>
    )
}
