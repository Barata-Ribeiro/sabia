"use client"

import putUpdateUserProfile from "@/actions/user/put-update-user-profile"
import Button from "@/components/shared/button"
import Input from "@/components/shared/input"
import LinkButton from "@/components/shared/link-button"
import { useForm } from "@/hooks/useForm"
import { UserContextResponse } from "@/interfaces/user"
import { useRouter } from "@/navigation"
import { NULL_AVATAR } from "@/utils/constants"
import tw from "@/utils/tw"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { useEffect } from "react"
import { FaCircleExclamation } from "react-icons/fa6"
import { HiAtSymbol, HiEnvelope, HiIdentification, HiLink, HiLockClosed, HiPhoto } from "react-icons/hi2"

interface EditAccountFormProps {
    user: UserContextResponse
    coverBlur: string | undefined
    avatarBlur: string | undefined
}

export default function EditAccountForm({ user, coverBlur, avatarBlur }: Readonly<EditAccountFormProps>) {
    const t = useTranslations("EditAccountForm")
    const { isPending, formState, formAction, onSubmit } = useForm(putUpdateUserProfile, {
        ok: false,
        clientError: null,
        response: null
    })
    const router = useRouter()

    useEffect(() => {
        if (formState.ok) router.refresh()
    }, [formState, router])

    const textAreaStyle = tw`peer h-full min-h-[6.25rem] w-full !resize-none rounded-[0.438rem] border border-background-200 border-t-transparent bg-white px-3 py-2.5 text-body-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-background-200 placeholder-shown:border-t-background-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-background-50`
    const labelTextAreaStyle = tw`before:content[' '] after:content[' '] pointer-events-none absolute -top-1.5 left-0 flex h-full w-full select-none text-[0.688rem] font-normal leading-tight text-body-400 transition-all before:pointer-events-none before:mr-1 before:mt-[0.406rem] before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-l before:border-t before:border-background-200 before:transition-all after:pointer-events-none after:ml-1 after:mt-[0.406rem] after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-r after:border-t after:border-background-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-body-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[0.688rem] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-l-2 peer-focus:before:border-t-2 peer-focus:before:!border-gray-900 peer-focus:after:border-r-2 peer-focus:after:border-t-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-body-500`

    return (
        <form action={formAction} onSubmit={onSubmit}>
            <fieldset className="mb-6 grid gap-6 rounded-lg border p-4 transition-colors hover:bg-background-100 md:grid-cols-2">
                <legend className="px-2 font-heading text-sm text-body-900 antialiased dark:text-body-100">
                    {t("AccountInformation.Title")}
                </legend>
                <div>
                    <Input
                        label={t("AccountInformation.InputUsername")}
                        name="username"
                        icon={<HiAtSymbol size={22} />}
                        autoComplete="off"
                        minLength={3}
                        maxLength={20}
                        className="px-3 py-2.5"
                    />
                    <p className="text-body-600">
                        {t("AccountInformation.DescriptionUsername")}
                        {/* */}
                        <strong>@{user.username}</strong>.
                    </p>
                </div>
                <div>
                    <Input
                        label={t("AccountInformation.InputDisplayName")}
                        name="displayName"
                        minLength={3}
                        maxLength={20}
                        className="px-3 py-2.5"
                    />
                    <p className="text-body-600">
                        {t("AccountInformation.DescriptionDisplayName")}
                        {/* */}
                        <strong>{user.displayName}</strong>.
                    </p>
                </div>
                <div>
                    <Input
                        label={t("AccountInformation.InputEmail")}
                        name="email"
                        type="email"
                        icon={<HiEnvelope size={22} />}
                        className="px-3 py-2.5"
                    />
                    <p className="text-body-600">
                        {t("AccountInformation.DescriptionEmail")}
                        {/* */}
                        <strong>{user.email}</strong>.
                    </p>
                </div>
            </fieldset>
            <fieldset className="mb-6 grid gap-6 rounded-lg border p-4 transition-colors hover:bg-background-100 md:grid-cols-2">
                <legend className="px-2 font-heading text-sm text-body-900 antialiased dark:text-body-100">
                    {t("PersonalInformation.Title")}
                </legend>
                <div>
                    <div className="grid items-center gap-2 md:grid-cols-2">
                        <Input
                            label={t("PersonalInformation.InputFirstName")}
                            name="firstName"
                            className="px-3 py-2.5"
                        />
                        <Input label={t("PersonalInformation.InputLastName")} name="lastName" className="px-3 py-2.5" />
                    </div>
                    <p className="text-body-600">
                        {t("PersonalInformation.DescriptionFullName")}
                        {/* */}
                        <strong>{user.fullName}</strong>.
                    </p>
                </div>
                <div>
                    <Input
                        label={t("PersonalInformation.InputBirthDate")}
                        name="birthDate"
                        type="date"
                        className="px-3 py-2.5"
                    />
                    <p className="text-body-600">
                        {t("PersonalInformation.DescriptionBirthDate")}
                        {/* */}
                        <strong>{user.birthDate}</strong>.
                    </p>
                </div>
                <div>
                    <Input
                        label={t("PersonalInformation.InputGender")}
                        name="gender"
                        icon={<HiIdentification size={22} />}
                        className="px-3 py-2.5"
                    />
                    <p className="text-body-600">
                        {user.gender
                            ? `${t("PersonalInformation.DescriptionBirthDate")}<strong>${user.gender}</strong>.`
                            : t("PersonalInformation.NoGender")}
                    </p>
                </div>
            </fieldset>
            <fieldset className="mb-6 grid gap-6 rounded-lg border p-4 transition-colors hover:bg-background-100 md:grid-cols-2">
                <legend className="px-2 font-heading text-sm text-body-900 antialiased dark:text-body-100">
                    {t("PublicInformation.Title")}
                </legend>
                <div className="flex flex-col gap-2 md:flex-row">
                    <span className="relative aspect-square">
                        <Image
                            src={user.avatarImageUrl ?? NULL_AVATAR}
                            alt={t("PublicInformation.Avatar.Alt")}
                            className="rounded object-cover italic"
                            placeholder="blur"
                            blurDataURL={avatarBlur}
                            quality={50}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority
                            fill
                        />
                    </span>
                    <div className="flex w-max flex-col gap-1 font-heading font-semibold">
                        <Input
                            type="url"
                            label="Avatar Url"
                            name="avatarUrl"
                            icon={<HiPhoto size={22} />}
                            className="px-3 py-2.5"
                        />
                        <p className="flex items-center gap-2 text-sm text-primary-700 antialiased">
                            <FaCircleExclamation size={14} />
                            <span className="w-max">{t("PublicInformation.URLWarning")}</span>
                        </p>
                        <p className="mt-4 max-w-[40ch] text-sm text-body-500">
                            {t("PublicInformation.Avatar.Disclaimer")}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col gap-2 md:flex-row">
                    {user.coverImageUrl && (
                        <span className="relative aspect-square">
                            <Image
                                src={user.coverImageUrl}
                                className="rounded object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                placeholder="blur"
                                blurDataURL={coverBlur}
                                quality={80}
                                priority
                                fill
                                alt={t("PublicInformation.Cover.Alt")}
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
                            <span className="w-max">{t("PublicInformation.URLWarning")}</span>
                        </p>
                        <p className="mt-4 max-w-[40ch] text-sm text-body-500">
                            {t("PublicInformation.Cover.Disclaimer")}
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
                            aria-label={t("PublicInformation.InputBio")}
                            className={textAreaStyle}
                            placeholder=" "
                        ></textarea>
                        <label htmlFor="new-bio" className={labelTextAreaStyle}>
                            {t("PublicInformation.InputBio")}
                        </label>
                    </div>
                    <p className="text-body-600">
                        {user.biography
                            ? `${t("PublicInformation.DescriptionBio")}<strong>${user.biography}</strong>.`
                            : t("PublicInformation.NoBio")}
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
                                ? `${t("PublicInformation.DescriptionWebsite")}<strong>${user.website}</strong>.`
                                : t("PublicInformation.NoWebsite")}
                        </p>
                    </div>
                    <div>
                        <div className="flex gap-2">
                            <Input
                                type="text"
                                label={t("PublicInformation.Location.InputState")}
                                name="locState"
                                className="px-3 py-2.5"
                            />
                            <Input
                                type="text"
                                label={t("PublicInformation.Location.InputCountry")}
                                name="locCountry"
                                className="px-3 py-2.5"
                            />
                        </div>
                        <p className="text-body-600">
                            {user.location
                                ? `${t("PublicInformation.Location.Description")}<strong>${user.location}</strong>.`
                                : t("PublicInformation.Location.NoLocation")}
                        </p>
                    </div>
                </div>
            </fieldset>
            <fieldset className="mb-6 grid gap-6 rounded-lg border p-4 transition-colors hover:bg-background-100 md:grid-cols-2">
                <legend className="px-2 font-heading text-sm text-body-900 antialiased dark:text-body-100">
                    {t("SecurityInformation.Title")}
                </legend>
                <div>
                    <Input
                        type="password"
                        label={t("SecurityInformation.InputNewPassword")}
                        name="newPassword"
                        className="px-3 py-2.5"
                        icon={<HiLockClosed size={22} />}
                        autoComplete="new-password"
                    />
                    <p className="flex w-fit items-center gap-2 self-center text-sm text-primary-700 antialiased">
                        <FaCircleExclamation size={14} />
                        <span className="w-[55ch]">{t("SecurityInformation.PasswordRequirements")}</span>
                    </p>
                </div>
                <Input
                    label={t("SecurityInformation.InputConfirmPassword")}
                    name="confirmPassword"
                    type="password"
                    autoComplete="off"
                    icon={<HiLockClosed size={22} />}
                    className="px-3 py-2.5"
                />
            </fieldset>
            <div className="flex flex-col gap-6 self-center">
                <div className="flex max-w-[20rem] flex-col gap-4 self-center">
                    <p className="text-pretty text-center text-xl leading-6">{t("ConfirmChanges.Disclaimer")}</p>
                    <Input
                        label={t("ConfirmChanges.InputPassword")}
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
                        {t("ConfirmChanges.Terms.Part-1")}
                        <LinkButton
                            href={"/terms-of-use"}
                            className="font-heading text-body-600 transition-colors duration-300 hover:text-accent-500 hover:underline dark:text-body-400 dark:hover:text-accent-200"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {t("ConfirmChanges.Terms.Link")}
                        </LinkButton>
                        {t("ConfirmChanges.Terms.Part-2")}
                    </label>
                </div>
                <Button type="submit" className="py-2 font-medium" disabled={isPending} aria-disabled={isPending}>
                    {isPending ? t("ConfirmChanges.ButtonLoading") : t("ConfirmChanges.ButtonSubmit")}
                </Button>
            </div>
        </form>
    )
}
