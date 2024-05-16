"use server"

import { redirect } from "@/navigation"
import { cookies } from "next/headers"

export default async function logout() {
    cookies().delete("auth_token")

    redirect("/")
}
