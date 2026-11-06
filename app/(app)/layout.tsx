import { Sidebar } from "@/components/layout/sidebar"
import { requireUser } from "@/lib/session"
import type { ReactNode } from "react"

export default async function AppLayout({
  children,
}: {
  children: ReactNode
}) {
  const user = await requireUser()

  return (
    <div className="min-h-screen bg-muted/30">
      <Sidebar userName={user.name ?? user.email ?? "Usuário"} />
      <main className="ml-64 min-h-screen p-8">{children}</main>
    </div>
  )
}
