import { redirect } from "@/navigation"

interface ReplyPageProps {
    params: { username: string; id: string }
}

export default function ReplyPage({ params }: ReplyPageProps) {
    return redirect("/" + params.username + "/status/" + params.id)
}
