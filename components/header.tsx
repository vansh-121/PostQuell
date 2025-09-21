"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { PenTool, Home, BookOpen, User, BarChart3 } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-xl">
            <PenTool className="h-5 w-5 text-primary" />
          </div>
          <Link href="/" className="text-2xl font-bold text-foreground tracking-tight">
            PostQuell
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-1">
          <Button variant="ghost" asChild className="h-9 px-3">
            <Link href="/" className="flex items-center space-x-2 text-sm font-medium">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
          </Button>
          <Button variant="ghost" asChild className="h-9 px-3">
            <Link href="/blogs" className="flex items-center space-x-2 text-sm font-medium">
              <BookOpen className="h-4 w-4" />
              <span>All Blogs</span>
            </Link>
          </Button>
          <Button variant="ghost" asChild className="h-9 px-3">
            <Link href="/dashboard" className="flex items-center space-x-2 text-sm font-medium">
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </Button>
        </nav>

        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <Button asChild size="sm" className="h-9">
            <Link href="/create">
              <PenTool className="h-4 w-4 mr-2" />
              Write
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
