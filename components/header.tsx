"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PenTool, Home, BookOpen, User, BarChart3 } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <PenTool className="h-8 w-8 text-primary" />
          <Link href="/" className="text-2xl font-bold text-primary font-[family-name:var(--font-playfair)]">
            PostQuell
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/"
            className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary"
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
          <Link
            href="/blogs"
            className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary"
          >
            <BookOpen className="h-4 w-4" />
            <span>All Blogs</span>
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary"
          >
            <BarChart3 className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/create"
            className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary"
          >
            <PenTool className="h-4 w-4" />
            <span>Create</span>
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Button asChild>
            <Link href="/create">
              <PenTool className="h-4 w-4 mr-2" />
              Write
            </Link>
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
