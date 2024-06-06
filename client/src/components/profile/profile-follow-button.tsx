"use client"

import deleteUserFollow from "@/actions/user/delete-user-follow"
import postUserFollow from "@/actions/user/post-user-follow"
import Button from "@/components/shared/button"
import { useUser } from "@/context/user-context-provider"
import { UserPublicProfileResponse } from "@/interfaces/user"
import { useRouter } from "@/navigation"
import { useLocale } from "next-intl"
import { type MouseEvent, useEffect, useState } from "react"

export default function ProfileFollowButton({
    profile
}: {
    profile: UserPublicProfileResponse
}) {
    const localeActive = useLocale()
    const isEnglishLang = localeActive === "en"
    const router = useRouter()

    const { user } = useUser()
    const isOwnProfile = user?.id === profile.id

    const [isFollowing, setIsFollowing] = useState(false)
    const [isLoading, setIsLoading] = useState(!isOwnProfile)

    const errorMessage = isEnglishLang
        ? "An unknown error occurred."
        : "Um error desconhecido ocorreu."

    useEffect(() => {
        if (user && !isOwnProfile) {
            setIsLoading(true)
            setIsFollowing(profile.is_following)
            setIsLoading(false)
        }
    }, [isOwnProfile, user, profile.is_following])

    function handleEditProfile(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        router.push("/settings")
    }

    async function handleFollow(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        setIsLoading(true)

        try {
            if (user && !isOwnProfile) {
                setIsFollowing(!isFollowing)

                const response = isFollowing
                    ? await deleteUserFollow(user?.id, profile.id)
                    : await postUserFollow(user?.id, profile.id)

                if (!response.ok) {
                    setIsFollowing(!isFollowing)
                    alert(response.client_error ?? errorMessage)
                }
            }
        } catch {
            setIsFollowing(isFollowing)
            alert(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button
            onClick={isOwnProfile ? handleEditProfile : handleFollow}
            aria-label={
                isOwnProfile ? "Edit Profile" : isFollowing ? "Unfollow" : "Follow"
            }
            title={isOwnProfile ? "Edit Profile" : isFollowing ? "Unfollow" : "Follow"}
            className="px-2 py-0 font-heading text-sm md:rounded-full md:px-4 md:py-2 md:text-base"
            disabled={isLoading}
            aria-disabled={isLoading}
        >
            {isLoading
                ? "Loading..."
                : isOwnProfile
                  ? "Edit Profile"
                  : isFollowing
                    ? "Unfollow"
                    : "Follow"}
        </Button>
    )
}
