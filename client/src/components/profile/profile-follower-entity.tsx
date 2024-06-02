"use client"

import CircularPagination from "@/components/feed/circular-pagination"
import ProfileFollowButton from "@/components/profile/profile-follow-button"
import LinkButton from "@/components/shared/link-button"
import { UserPublicProfileResponse } from "@/interfaces/user"
import { NULL_AVATAR } from "@/utils/constants"
import Image from "next/image"
import { HiCheckBadge } from "react-icons/hi2"
import { twMerge } from "tailwind-merge"

interface ProfileFollowerEntityProps {
    follower: UserPublicProfileResponse
    resolvedListOfBlurredDataUrl: ({
        followerId: string
        blurredDataUrl: string | undefined
    } | null)[]
    totalPages: number
    page: number
}

export default function ProfileFollowerEntity({
    follower,
    resolvedListOfBlurredDataUrl,
    totalPages,
    page
}: ProfileFollowerEntityProps) {
    return (
        <div key={follower.id} className="p-4">
            <div className="flex items-center justify-between">
                <LinkButton
                    href={"/" + follower.username}
                    className="flex w-fit cursor-pointer items-center gap-4"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image
                        src={follower.avatar_image_url ?? NULL_AVATAR}
                        alt={follower.username}
                        className="h-12 w-12 rounded-full object-cover"
                        placeholder={follower.avatar_image_url ? "blur" : "empty"}
                        blurDataURL={
                            resolvedListOfBlurredDataUrl.find(
                                (data) => data?.followerId === follower.id
                            )?.blurredDataUrl
                        }
                        width={48}
                        height={48}
                    />
                    <div className="w-max">
                        <h3
                            className={twMerge(
                                "font-heading font-bold text-body-900",
                                follower.is_verified && "flex items-center gap-1"
                            )}
                        >
                            {follower.display_name}{" "}
                            {follower.is_verified && (
                                <span
                                    className="text-accent-600"
                                    title="Verified"
                                    aria-label="Verified"
                                >
                                    <HiCheckBadge size={22} />
                                </span>
                            )}
                        </h3>
                        <p className="font-body text-sm text-body-500">
                            @{follower.username}
                        </p>
                    </div>
                </LinkButton>
                <div className="w-fit">
                    <ProfileFollowButton userId={follower.id} />
                </div>
            </div>
            {totalPages > 1 && (
                <CircularPagination totalPages={totalPages} page={page} />
            )}
        </div>
    )
}
