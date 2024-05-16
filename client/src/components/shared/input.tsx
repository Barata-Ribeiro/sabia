import tw from "@/utils/tw"
import type { ComponentProps, ReactNode } from "react"
import { twMerge } from "tailwind-merge"

interface InputProps extends ComponentProps<"input"> {
    label: string
    icon?: ReactNode
}

export default function Input({ label, icon, className, ...props }: InputProps) {
    const sortedClasses = tw`peer h-full w-full rounded-[7px] border border-background-200
                                    border-t-transparent bg-white font-sans text-sm
                                    font-normal text-body-700 outline outline-0 transition-all placeholder-shown:border
                                    placeholder-shown:border-background-200 placeholder-shown:border-t-background-200
                                    focus:border-2 focus:border-background-900 focus:border-t-transparent
                                    focus:outline-0 disabled:border-0 disabled:bg-background-50`

    const mergedClassName = twMerge(sortedClasses, className)

    const lowerCaseLabel = label.toLowerCase()

    return (
        <div className="relative h-10 w-full min-w-[200px]">
            {icon && (
                <div className="absolute right-3 top-2/4 grid -translate-y-2/4 place-items-center text-body-500">
                    {icon}
                </div>
            )}
            <input
                className={mergedClassName}
                type={props.type || "text"}
                name={props.name || lowerCaseLabel}
                id={lowerCaseLabel}
                placeholder=" "
                {...props}
            />
            <label
                htmlFor={lowerCaseLabel}
                className="before:content[' '] after:content[' '] pointer-events-none absolute
                    -top-1.5 left-0 flex h-full w-full select-none !overflow-visible truncate font-heading
                    text-[11px] font-normal leading-tight text-background-500 transition-all before:pointer-events-none before:mr-1
                    before:mt-[6.5px] before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md
                    before:border-l before:border-t before:border-background-200 before:transition-all after:pointer-events-none
                    after:ml-1 after:mt-[6.5px] after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md
                    after:border-r after:border-t after:border-background-200 after:transition-all peer-placeholder-shown:text-sm
                    peer-placeholder-shown:leading-[4] peer-placeholder-shown:text-body-500 peer-placeholder-shown:before:border-transparent
                    peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-background-900
                    peer-focus:before:border-l-2 peer-focus:before:border-t-2 peer-focus:before:!border-background-900 peer-focus:after:border-r-2
                    peer-focus:after:border-t-2 peer-focus:after:!border-background-900 peer-disabled:text-transparent peer-disabled:before:border-transparent
                    peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-body-500"
            >
                {label}
            </label>
        </div>
    )
}
