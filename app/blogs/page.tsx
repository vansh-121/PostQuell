"use client"

import { Header } from "@/components/header"
import { BlogCard } from "@/components/blog-card"
import { useBlogStore } from "@/hooks/use-blog-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Filter, BookOpen, PenTool } from "lucide-react"
import Link from "next/link"
import { useState, useMemo } from "react"

export default function BlogsPage() {
  const { posts } = useBlogStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest")

  // Get all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    posts.forEach((post) => {
      post.tags.forEach((tag) => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  }, [posts])

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    const filtered = posts.filter((post) => {
      const matchesSearch =
        searchQuery === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesTag = selectedTag === null || post.tags.includes(selectedTag)

      return matchesSearch && matchesTag
    })

    // Sort posts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return b.createdAt.getTime() - a.createdAt.getTime()
        case "oldest":
          return a.createdAt.getTime() - b.createdAt.getTime()
        case "title":
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

    return filtered
  }, [posts, searchQuery, selectedTag, sortBy])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto py-8 px-4">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-[family-name:var(--font-playfair)]">
            All Blog Posts
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover stories, insights, and ideas from our community of writers.
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search posts, authors, or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "newest" | "oldest" | "title")}
                  className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="title">Alphabetical</option>
                </select>
              </div>
            </div>

            {/* Tags Filter */}
            {allTags.length > 0 && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedTag === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTag(null)}
                  >
                    All Posts
                  </Button>
                  {allTags.map((tag) => (
                    <Button
                      key={tag}
                      variant={selectedTag === tag ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">
            {filteredPosts.length === 0
              ? "No posts found"
              : `Showing ${filteredPosts.length} ${filteredPosts.length === 1 ? "post" : "posts"}`}
            {searchQuery && ` for "${searchQuery}"`}
            {selectedTag && ` tagged with "${selectedTag}"`}
          </p>

          <Button asChild>
            <Link href="/create">
              <PenTool className="h-4 w-4 mr-2" />
              Write New Post
            </Link>
          </Button>
        </div>

        {/* Blog Posts Grid */}
        {filteredPosts.length === 0 ? (
          <Card>
            <CardContent className="text-center">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Posts Found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || selectedTag
                  ? "Try adjusting your search or filter criteria."
                  : "Be the first to create a blog post!"}
              </p>
              {!searchQuery && !selectedTag && (
                <Button asChild>
                  <Link href="/create">
                    <PenTool className="h-4 w-4 mr-2" />
                    Create Your First Post
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} showActions={true} />
            ))}
          </div>
        )}

        {/* Call to Action */}
        {filteredPosts.length > 0 && (
          <div className="mt-16 text-center">
            <Card className="bg-muted/30">
              <CardContent>
                <h3 className="text-2xl font-bold mb-4 font-[family-name:var(--font-playfair)]">
                  Have Something to Share?
                </h3>
                <p className="text-muted-foreground mb-6">
                  Join our community of writers and share your unique perspective with the world.
                </p>
                <Button asChild size="lg">
                  <Link href="/create">
                    <PenTool className="h-4 w-4 mr-2" />
                    Start Writing
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
