"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Navigation() {
  return (
    <nav className="border-b border-border bg-card">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-serif font-bold text-primary">
          Wellness Hub
        </Link>
        <div className="flex gap-4">
          <Link href="/">
            <Button variant="ghost" className="text-foreground hover:text-primary">
              Home
            </Button>
          </Link>
          <Link href="/knowledge">
            <Button variant="ghost" className="text-foreground hover:text-primary">
              Knowledge
            </Button>
          </Link>
          <Link href="/planner">
            <Button variant="ghost" className="text-foreground hover:text-primary">
              Planner
            </Button>
          </Link>
          <Link href="/sounds">
            <Button variant="ghost" className="text-foreground hover:text-primary">
              Sounds
            </Button>
          </Link>
          <Link href="/settings">
            <Button variant="ghost" className="text-foreground hover:text-primary">
              Settings
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
