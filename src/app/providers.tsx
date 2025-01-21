"use client"

import { ThemeProvider } from "next-themes"
import { ToastProvider } from "@/components/ui/toast"
import { Toaster } from "@/components/ui/toaster"
import { SessionProvider } from "next-auth/react"

export function Providers({
  children,
}: // pageProps,
{
  children: React.ReactNode
  // pageProps: any
}) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ToastProvider>
          {children}
          <Toaster />
        </ToastProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}
