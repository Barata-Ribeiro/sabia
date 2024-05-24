"use client"

import Input from "@/components/shared/input"
import { UserContextResponse } from "@/interfaces/user"
import { NULL_AVATAR } from "@/utils/constants"
import Image from "next/image"
import { FaCircleExclamation } from "react-icons/fa6"
import { HiAtSymbol, HiEnvelope, HiPhoto } from "react-icons/hi2"

export default function EditAccountForm({ user }: { user: UserContextResponse }) {
    return (
        <form action="">
            <fieldset className="mb-6 grid gap-6 rounded-lg border p-4 transition-colors hover:bg-background-100 md:grid-cols-2">
                <legend className="px-2 font-heading text-sm text-body-900 antialiased dark:text-body-100">
                    Account Information
                </legend>
                <div>
                    <Input
                        label="Username"
                        name="username"
                        icon={<HiAtSymbol size={22} />}
                        className="px-3 py-2.5"
                    />
                    <p className="text-body-600">
                        Your username is <strong>@{user.username}</strong>.
                    </p>
                </div>
                <div>
                    <Input
                        label="Display name"
                        name="displayName"
                        className="px-3 py-2.5"
                    />
                    <p className="text-body-600">
                        Your display name is <strong>{user.display_name}</strong>.
                    </p>
                </div>
                <div>
                    <Input
                        label="Email"
                        name="email"
                        type="email"
                        icon={<HiEnvelope size={22} />}
                        className="px-3 py-2.5"
                    />
                    <p className="text-body-600">
                        Your email address is <strong>{user.email}</strong>.
                    </p>
                </div>
            </fieldset>
            <fieldset className="mb-6 grid gap-6 rounded-lg border p-4 transition-colors hover:bg-background-100 md:grid-cols-2">
                <legend className="px-2 font-heading text-sm text-body-900 antialiased dark:text-body-100">
                    Personal Information
                </legend>
                <div>
                    <div className="grid items-center gap-2 md:grid-cols-2">
                        <Input
                            label="First name"
                            name="firstName"
                            className="px-3 py-2.5"
                        />
                        <Input
                            label="Last name"
                            name="lastName"
                            className="px-3 py-2.5"
                        />
                    </div>
                    <p className="text-body-600">
                        Your full name is <strong>{user.full_name}</strong>.
                    </p>
                </div>
                <div>
                    <Input
                        label="Birth date"
                        name="birthDate"
                        type="date"
                        className="px-3 py-2.5"
                    />
                    <p className="text-body-600">
                        Your birth date is <strong>{user.birth_date}</strong>.
                    </p>
                </div>
                <div>
                    <Input label="Gender" name="gender" className="px-3 py-2.5" />
                    <p className="text-body-600">
                        {user.gender
                            ? `Your gender is <strong>${user.gender}</strong>.`
                            : `You haven't set your gender yet.`}
                    </p>
                </div>
            </fieldset>
            <fieldset className="grid gap-6 rounded-lg border p-4 transition-colors hover:bg-background-100 md:grid-cols-2">
                <legend className="px-2 font-heading text-sm text-body-900 antialiased dark:text-body-100">
                    Public Information
                </legend>
                <div className="flex gap-2">
                    <Image
                        src={user.avatar_image_url ?? NULL_AVATAR}
                        style={{ width: "auto", height: "auto" }}
                        className="aspect-square h-20 w-20 rounded object-cover"
                        width={128}
                        height={128}
                        quality={50}
                        priority
                        alt=" "
                    />
                    <div className="flex w-full flex-col gap-1 font-heading font-semibold">
                        <Input
                            type="url"
                            label="Avatar Url"
                            name="avatarUrl"
                            icon={<HiPhoto size={22} />}
                            className="px-3 py-2.5"
                        />
                        <p className="flex w-fit items-center gap-2 text-sm text-primary-700 antialiased">
                            <FaCircleExclamation size={14} />
                            <span className="w-[55ch]">
                                Only HTTPS URLs are allowed.
                            </span>
                        </p>
                        <p className="mt-4 text-sm text-body-500">
                            Please, use a square image for the best results. Follow the
                            rules for the best experience.
                        </p>
                    </div>
                </div>
                <div className="flex w-full flex-col gap-1 font-heading font-semibold">
                    <Input
                        type="url"
                        label="Cover Url"
                        name="coverUrl"
                        icon={<HiPhoto size={22} />}
                        className="px-3 py-2.5"
                    />
                    <p className="flex w-fit items-center gap-2 text-sm text-primary-700 antialiased">
                        <FaCircleExclamation size={14} />
                        <span className="w-[55ch]">Only HTTPS URLs are allowed.</span>
                    </p>
                </div>
            </fieldset>
        </form>
    )
}
