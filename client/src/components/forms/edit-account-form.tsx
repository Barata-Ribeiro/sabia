"use client"

import Button from "@/components/shared/button"
import Input from "@/components/shared/input"
import LinkButton from "@/components/shared/link-button"
import { UserContextResponse } from "@/interfaces/user"
import { NULL_AVATAR } from "@/utils/constants"
import tw from "@/utils/tw"
import Image from "next/image"
import { FaCircleExclamation } from "react-icons/fa6"
import {
    HiAtSymbol,
    HiEnvelope,
    HiIdentification,
    HiLink,
    HiLockClosed,
    HiPhoto
} from "react-icons/hi2"

interface EditAccountFormProps {
    user: UserContextResponse
    coverBlur: string | undefined
    avatarBlur: string | undefined
}

export default function EditAccountForm({
    user,
    coverBlur,
    avatarBlur
}: EditAccountFormProps) {
    const textAreaStyle = tw`peer h-full min-h-[6.25rem] w-full !resize-none rounded-[0.438rem]
                        border border-background-200 border-t-transparent bg-white px-3 py-2.5
                        text-body-700 outline outline-0 transition-all placeholder-shown:border
                        placeholder-shown:border-background-200 placeholder-shown:border-t-background-200
                        focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0
                        disabled:resize-none disabled:border-0 disabled:bg-background-50`

    const labelTextAreaStyle = tw`before:content[' '] after:content[' '] pointer-events-none absolute
                    -top-1.5 left-0 flex h-full w-full select-none text-[0.688rem] font-normal leading-tight
                    text-body-400 transition-all before:pointer-events-none before:mr-1
                    before:mt-[0.406rem] before:box-border before:block before:h-1.5 before:w-2.5
                    before:rounded-tl-md before:border-l before:border-t before:border-background-200
                    before:transition-all after:pointer-events-none after:ml-1 after:mt-[0.406rem]
                    after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md
                    after:border-r after:border-t after:border-background-200 after:transition-all
                    peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75]
                    peer-placeholder-shown:text-body-500 peer-placeholder-shown:before:border-transparent
                    peer-placeholder-shown:after:border-transparent peer-focus:text-[0.688rem]
                    peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-l-2
                    peer-focus:before:border-t-2 peer-focus:before:!border-gray-900 peer-focus:after:border-r-2
                    peer-focus:after:border-t-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent
                    peer-disabled:before:border-transparent peer-disabled:after:border-transparent
                    peer-disabled:peer-placeholder-shown:text-body-500`

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
                        autoComplete="off"
                        minLength={3}
                        maxLength={20}
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
                        minLength={3}
                        maxLength={20}
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
                    <Input
                        label="Gender"
                        name="gender"
                        icon={<HiIdentification size={22} />}
                        className="px-3 py-2.5"
                    />
                    <p className="text-body-600">
                        {user.gender
                            ? `Your gender is <strong>${user.gender}</strong>.`
                            : `You haven't set your gender yet.`}
                    </p>
                </div>
            </fieldset>
            <fieldset className="mb-6 grid gap-6 rounded-lg border p-4 transition-colors hover:bg-background-100 md:grid-cols-2">
                <legend className="px-2 font-heading text-sm text-body-900 antialiased dark:text-body-100">
                    Public Information
                </legend>
                <div className="flex flex-col gap-2 md:flex-row">
                    <span className="relative aspect-square">
                        <Image
                            src={user.avatar_image_url ?? NULL_AVATAR}
                            className="rounded object-cover"
                            placeholder="blur"
                            blurDataURL={avatarBlur}
                            quality={50}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority
                            fill
                            alt="Avatar Image"
                        />
                    </span>
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
                        <p className="mt-4 max-w-[40ch] text-sm text-body-500">
                            Please, use a square image for the best results. Follow the
                            rules for the best experience.
                        </p>
                    </div>
                </div>
                <div className="flex flex-col gap-2 md:flex-row">
                    {user.cover_image_url && (
                        <span className="relative aspect-square">
                            <Image
                                src={user.cover_image_url}
                                className="rounded object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                placeholder="blur"
                                blurDataURL={coverBlur}
                                quality={80}
                                priority
                                fill
                                alt="Cover Image"
                            />
                        </span>
                    )}
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
                            <span className="w-[55ch]">
                                Only HTTPS URLs are allowed.
                            </span>
                        </p>
                        <p className="mt-4 max-w-[40ch] text-sm text-body-500">
                            Please, use a rectangle image for the best results. Follow
                            the rules for the best experience.
                        </p>
                    </div>
                </div>
                <div>
                    <div className="relative w-full">
                        <textarea
                            id="new-bio"
                            name="newBio"
                            rows={3}
                            maxLength={280}
                            aria-label="Biography"
                            className={textAreaStyle}
                            placeholder=" "
                        ></textarea>
                        <label className={labelTextAreaStyle}>Biography</label>
                    </div>
                    <p className="text-body-600">
                        {user.biography
                            ? `Your biography is <strong>${user.biography}</strong>.`
                            : `You haven't set your biography yet.`}
                    </p>
                </div>
                <div className="flex flex-col gap-2">
                    <div>
                        <Input
                            label="Website"
                            name="website"
                            icon={<HiLink size={22} />}
                            type="url"
                            className="px-3 py-2.5"
                        />
                        <p className="text-body-600">
                            {user.website
                                ? `Your website is <strong>${user.website}</strong>.`
                                : `You haven't set your website yet.`}
                        </p>
                    </div>
                    <div>
                        <div className="flex gap-2">
                            <Input
                                label="State"
                                name="locState"
                                className="px-3 py-2.5"
                            />
                            <Input
                                label="Country"
                                name="locCountry"
                                className="px-3 py-2.5"
                            />
                        </div>
                        <p className="text-body-600">
                            {user.location
                                ? `Your location is <strong>${user.location}</strong>.`
                                : `You haven't set your location yet.`}
                        </p>
                    </div>
                </div>
            </fieldset>
            <fieldset className="mb-6 grid gap-6 rounded-lg border p-4 transition-colors hover:bg-background-100 md:grid-cols-2">
                <legend className="px-2 font-heading text-sm text-body-900 antialiased dark:text-body-100">
                    Security Information
                </legend>
                <div>
                    <Input
                        label="New Password"
                        name="newPassword"
                        type="password"
                        autoComplete="new-password"
                        icon={<HiLockClosed size={22} />}
                        className="px-3 py-2.5"
                    />
                    <p className="flex w-fit items-center gap-2 self-center text-sm text-primary-700 antialiased">
                        <FaCircleExclamation size={14} />
                        <span className="w-[55ch]">
                            Use at least 8 characters, one uppercase, one lowercase, a
                            special character, and one number.
                        </span>
                    </p>
                </div>
                <Input
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    autoComplete="off"
                    icon={<HiLockClosed size={22} />}
                    className="px-3 py-2.5"
                />
            </fieldset>
            <div className="flex flex-col gap-6 self-center">
                <div className="flex max-w-[20rem] flex-col gap-4 self-center">
                    <p className="text-pretty text-center text-xl leading-6">
                        To edit your account, you need to provide your current password.
                    </p>
                    <Input
                        label="Current Password"
                        name="currentPassword"
                        type="password"
                        autoComplete="current-password"
                        className="px-3 py-2.5"
                        required
                        aria-required
                    />
                </div>
                <div className="flex items-center gap-2 self-center">
                    <input
                        className="form-checkbox h-4 w-4 rounded border-body-300 bg-white text-accent-600 focus:ring-2 focus:ring-accent-500 dark:border-body-600 dark:bg-body-700 dark:ring-offset-body-800 dark:focus:ring-accent-600"
                        type="checkbox"
                        name="terms-of-use"
                        id="terms-of-use"
                        required
                        aria-required
                    />
                    <label
                        htmlFor="terms-of-use"
                        className="inline-flex gap-1 text-body-600 dark:text-body-50 lg:text-body-950"
                    >
                        I still agree with the
                        <LinkButton
                            href={"/terms-of-use"}
                            className="font-heading text-body-600 transition-colors duration-300 hover:text-accent-500 hover:underline dark:text-body-400 dark:hover:text-accent-200"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Terms of use
                        </LinkButton>
                        while editing my account.
                    </label>
                </div>
                <Button type="submit" className="py-2">
                    Edit Account
                </Button>
            </div>
        </form>
    )
}
