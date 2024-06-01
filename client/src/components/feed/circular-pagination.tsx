import type { JSX } from "react"
import { HiMiniArrowLeft, HiMiniArrowRight } from "react-icons/hi2"

export default function CircularPagination(props: {
    onClick: () => void
    page: number
    values: number
    callbackfn: (_: unknown, index: number) => JSX.Element
    onClick1: () => void
    callbackfn1: (_: unknown, index: number) => JSX.Element
    onClick2: () => void
}) {
    return (
        <div className="flex items-center gap-4">
            <button
                type="button"
                className="flex items-center gap-2 rounded-full disabled:opacity-50"
                onClick={props.onClick}
                disabled={props.page === 0}
            >
                <HiMiniArrowLeft size={16} /> Previous
            </button>
            <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(props.values, 5) }).map(
                    props.callbackfn
                )}
                {props.values > 5 && (
                    <button
                        className="cursor-pointer rounded-full px-2 py-1 hover:bg-background-100"
                        onClick={props.onClick1}
                    >
                        ...
                    </button>
                )}
                {Array.from({ length: Math.min(props.values, 2) }).map(
                    props.callbackfn1
                )}
            </div>
            <button
                type="button"
                className="flex items-center gap-2 rounded-full disabled:opacity-50"
                onClick={props.onClick2}
                disabled={props.page === props.values - 1}
            >
                Next
                <HiMiniArrowRight size={16} />
            </button>
        </div>
    )
}
