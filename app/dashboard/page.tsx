"use client"

import { Header } from "@/components/header"
import { BlogCard } from "@/components/blog-card"
import { useBlogStore } from "@/hooks/use-blog-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PenTool, BookOpen, Calendar, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useMemo } from "react"

export default function DashboardPage() {
  const { posts } = useBlogStore()

  const stats = useMemo(() => {
    const totalPosts = posts.length
    const totalTags = new Set(posts.flatMap((post) => post.tags)).size
    const recentPosts = posts.filter((post) => {
      const daysDiff = (Date.now() - post.createdAt.getTime()) / (1000 * 60 * 60 * 24)
      return daysDiff <= 7
    }).length

    return { totalPosts, totalTags, recentPosts }
  }, [posts])

  const recentPosts = useMemo(() => {
    return posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 6)
  }, [posts])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto py-8 px-4">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold font-[family-name:var(--font-playfair)]">My Dashboard</h1>
            <p className="text-muted-foreground mt-2">Manage your blog posts and track your writing progress.</p>
          </div>
          <Button asChild size="lg">
            <Link href="/create">
              <PenTool className="h-4 w-4 mr-2" />
              New Post
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPosts}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalPosts === 0 ? "Start writing your first post!" : "Keep up the great work!"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Posts</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-2xl font-bold">{stats.recentPosts}</div>
              <p className="text-xs text-muted-foreground">Published in the last 7 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tags Used</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTags}</div>
              <p className="text-xs text-muted-foreground">Unique topics covered</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Posts Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold font-[family-name:var(--font-playfair)]">Your Recent Posts</h2>
            <Button asChild variant="outline">
              <Link href="/blogs">View All Posts</Link>
            </Button>
          </div>

          {recentPosts.length === 0 ? (
            <Card>
              <CardContent className="text-center">
                <PenTool className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Posts Yet</h3>
                <p className="text-muted-foreground mb-6">Start your blogging journey by creating your first post.</p>
                <Button asChild>
                  <Link href="/create">
                    <PenTool className="h-4 w-4 mr-2" />
                    Create Your First Post
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPosts.map((post) => (
                <BlogCard key={post.id} post={post} showActions={true} />
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button asChild className="h-auto p-4 justify-start">
                <Link href="/create">
                  <div className="flex items-center space-x-3">
                    <PenTool className="h-6 w-6" />
                    <div className="text-left">
                      <div className="font-semibold">Write New Post</div>
                      <div className="text-sm text-primary-foreground/80">Share your thoughts with the world</div>
                    </div>
                  </div>
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-auto p-4 justify-start bg-transparent">
                <Link href="/blogs">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="h-6 w-6" />
                    <div className="text-left">
                      <div className="font-semibold">Browse All Posts</div>
                      <div className="text-sm text-muted-foreground">Explore and manage your content</div>
                    </div>
                  </div>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
