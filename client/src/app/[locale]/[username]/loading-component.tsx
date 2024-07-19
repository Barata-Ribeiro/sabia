export default function ProfileLoading() {
    return (
        <div className="max-w-[37.5rem] flex-1 border-x">
            <div className="w-full">
                <div className="mb-4 w-full px-4 pt-4">
                    <div className="h-16 rounded bg-gray-200"></div>
                </div>
                <div>
                    <div className="-px-4 h-48 w-full bg-gray-200"></div>

                    <div className="p-4">
                        <div className="flex justify-between">
                            <div className="-mt-24">
                                <div className="relative h-36 w-36 antialiased">
                                    <div className="h-full w-full rounded-full bg-gray-500"></div>
                                </div>
                            </div>

                            <div className="h-15 w-36 rounded-full bg-gray-200 font-heading"></div>
                        </div>

                        <div className="ml-3 mt-6 flex w-full flex-col justify-center gap-6 space-y-1">
                            <div className="flex flex-col gap-2">
                                <div className="flex h-8 w-28 gap-1 bg-gray-200"></div>
                                <div className="flex h-5 w-20 gap-1 bg-gray-200"></div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex h-4 w-48 gap-1 bg-gray-200"></div>
                                <div className="flex h-4 w-36 gap-1 bg-gray-200"></div>
                                <div className="flex h-4 w-24 gap-1 bg-gray-200"></div>
                            </div>

                            <div className="flex gap-2">
                                <div className="flex h-8 w-24 gap-1 bg-gray-200"></div>
                                <div className="flex h-8 w-24 gap-1 bg-gray-200"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <hr className="border-gray-200" />
            </div>
            <ul className="flex w-full snap-y flex-col divide-y">
                <li className="flex w-full animate-pulse flex-col gap-2 p-4">
                    <div className="flex w-full items-start gap-6">
                        <div className="aspect-square h-10 w-10 rounded-full bg-gray-500"></div>
                        <div className="flex flex-col gap-2">
                            <div className="flex h-4 w-36 gap-1 bg-gray-200"></div>
                            <div className="flex h-4 w-56 gap-1 bg-gray-200"></div>
                            <div className="flex h-4 w-64 gap-1 bg-gray-200"></div>
                        </div>
                    </div>
                </li>
                <li className="flex w-full animate-pulse flex-col gap-2 p-4">
                    <div className="flex w-full items-start gap-6">
                        <div className="aspect-square h-10 w-10 rounded-full bg-gray-500"></div>
                        <div className="flex flex-col gap-2">
                            <div className="flex h-4 w-36 gap-1 bg-gray-200"></div>
                            <div className="flex h-4 w-56 gap-1 bg-gray-200"></div>
                            <div className="flex h-4 w-64 gap-1 bg-gray-200"></div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    )
}
