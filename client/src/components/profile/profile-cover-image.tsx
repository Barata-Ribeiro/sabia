import { UserPublicProfileResponse } from "@/interfaces/user"
import Image from "next/image"

export default function ProfileCoverImage({
    profile
}: {
    profile: UserPublicProfileResponse
}) {
    return (
        <div id="profile-image" className="relative h-48 w-full">
            <Image
                className="pointer-events-none absolute object-cover object-center italic"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                src={profile.cover_image_url}
                alt="Cover Image"
                priority
                fill
            />
        </div>
    )
}
