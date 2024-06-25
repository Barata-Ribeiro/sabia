import LinkButton from "@/components/shared/link-button"
import { Fragment } from "react"

export default function formatTextWithHashtags(text: string, hashtags: string[]) {
    const hashtagRegex = /(#\w+\b)(?!;)/gi

    const parts = text.split(" ")

    return parts.map((part, index) => {
        const hashtag = part.replace("#", "")
        if (part.match(hashtagRegex) && hashtags.includes(hashtag)) {
            return (
                <Fragment key={index + "-" + hashtag}>
                    <LinkButton
                        href={"/hashtag/" + hashtag + "?page=0"}
                        id="hashtag-link"
                        className="select-auto hover:underline"
                        aria-label={"#" + hashtag}
                    >
                        {part + (index === parts.length - 1 ? "" : " ")}
                    </LinkButton>
                </Fragment>
            )
        }

        return part + (index === parts.length - 1 ? "" : " ")
    })
}
