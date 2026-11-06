"use client"

import { logoutAction } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
  ArrowLeftRight,
  LayoutDashboard,
  LogOut,
  Package,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/produtos", label: "Produtos", icon: Package },
  { href: "/movimentacoes", label: "Movimentações", icon: ArrowLeftRight },
]

export function Sidebar({ userName }: { userName: string }) {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 flex w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="px-5 py-6">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Sistema
        </p>
        <p className="mt-1 text-lg font-semibold">smart-hub</p>
      </div>
      <Separator />
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {items.map((item) => {
          const active = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                active && "bg-sidebar-accent text-sidebar-accent-foreground",
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-sidebar-border p-4">
        <p className="truncate text-sm font-medium">{userName}</p>
        <form action={logoutAction} className="mt-3">
          <Button type="submit" variant="outline" className="w-full">
            <LogOut />
            Sair
          </Button>
        </form>
      </div>
    </aside>
  )
}
