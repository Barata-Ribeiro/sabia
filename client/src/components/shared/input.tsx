// @flow
import tw from "@/utils/tw"
import { ComponentProps } from "react"
import { twMerge } from "tailwind-merge"

interface InputProps extends ComponentProps<"input"> {
    label: string
}

export default function Input({ label, className, ...props }: InputProps) {
    const sortedClasses = tw`form-input w-full border border-background-400 bg-background-50 text-sm placeholder-body-500 focus:border-blue-400 focus:outline-none sm:text-base`
    const mergedClassName = twMerge(sortedClasses, className)

    const lowerCaseLabel = label.toLowerCase()

    return (
        <div>
            <label
                className="text-md mb-1 font-heading tracking-wide text-body-800 sm:text-sm"
                htmlFor={lowerCaseLabel}
            >
                {label}
            </label>
            <input
                className={mergedClassName}
                type={props.type || "text"}
                name={props.name || lowerCaseLabel}
                id={lowerCaseLabel}
                placeholder={props.placeholder || label}
                {...props}
            />
        </div>
    )
}
