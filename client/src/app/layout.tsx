import type { Metadata }  from "next";
import "./globals.css";
import type { ReactNode } from "react";


export const metadata: Metadata = {
    title: "Sabiá",
    description: "Welcome to Sabiá - a microblogging platform for your thoughts and ideas."
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode; }>) {
    return (
            <html lang="en">
            <body>{ children }</body>
            </html>
    );
}
