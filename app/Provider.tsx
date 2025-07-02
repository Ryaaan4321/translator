"use client"
import { ReactNode } from "react"
import { SessionProvider } from "next-auth/react"


export function Provider({ children }: { children: ReactNode }) {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    )
}