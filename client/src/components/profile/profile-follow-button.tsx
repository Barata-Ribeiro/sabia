"use client"

import deleteUserFollow from "@/actions/user/delete-user-follow"
import getIfUserFollows from "@/actions/user/get-if-user-follows"
import postUserFollow from "@/actions/user/post-user-follow"
import Button from "@/components/shared/button"
import { useUser } from "@/context/user-context-provider"
import { useRouter } from "@/navigation"
import { useLocale } from "next-intl"
import { type MouseEvent, useEffect, useState } from "react"

export default function ProfileFollowButton({ userId }: { userId: string }) {
    const { user } = useUser()
    const isOwnProfile = user?.id === userId
    const localeActive = useLocale()
    const isEnglishLang = localeActive === "en"
    const router = useRouter()

    const [isFollowing, setIsFollowing] = useState(false)
    const [isLoading, setIsLoading] = useState(!isOwnProfile)

    const errorMessage = isEnglishLang
        ? "An unknown error occurred."
        : "Um error desconhecido ocorreu."

    useEffect(() => {
        if (user && !isOwnProfile) {
            setIsLoading(true)
            getIfUserFollows(user.id, userId)
                .then((response) => {
                    const data = response.response?.data as { follows: string }
                    setIsFollowing(data.follows === "true")
                    setIsLoading(false)
                })
                .catch(() => setIsLoading(false))
        }
    }, [isOwnProfile, user, userId])

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
                    ? await deleteUserFollow(user?.id, userId)
                    : await postUserFollow(user?.id, userId)

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
