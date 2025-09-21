"use client"

import { useBlogStore } from "@/hooks/use-blog-store"
import { BlogCard } from "./blog-card"

interface BlogGridProps {
  limit?: number
}

export function BlogGrid({ limit }: BlogGridProps) {
  const { posts } = useBlogStore()

  const displayPosts = limit ? posts.slice(0, limit) : posts

  if (displayPosts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No blog posts yet. Be the first to create one!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayPosts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  )
}
