import LinkButton from "@/components/shared/link-button"
import { UserPublicProfileResponse } from "@/interfaces/user"
import { NULL_AVATAR } from "@/utils/constants"
import Image from "next/image"

export default function ProfileAvatar({
    profile
}: {
    profile: UserPublicProfileResponse
}) {
    return (
        <div style={{ marginTop: "-6rem" }}>
            <div
                style={{ width: "9rem", height: "9rem" }}
                className="relative antialiased"
            >
                <Image
                    className="pointer-events-none absolute rounded-full border-4 border-background-900 object-cover object-center italic"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    src={profile.avatar_image_url ?? NULL_AVATAR}
                    alt="Profile Image"
                    priority
                    fill
                />
                <LinkButton
                    href={profile.avatar_image_url ?? NULL_AVATAR}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open Avatar Image in New Tab"
                >
                    <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden rounded-full bg-[hsl(0,0%,0%,0.2)] bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100"></div>
                </LinkButton>
            </div>
        </div>
    )
}
