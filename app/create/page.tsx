"use client"

import { Header } from "@/components/header"
import { BlogForm } from "@/components/blog-form"
import { useBlogStore } from "@/hooks/use-blog-store"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function CreatePage() {
  const { addPost } = useBlogStore()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data: {
    title: string
    content: string
    excerpt: string
    image?: string
    author: string
    tags: string[]
  }) => {
    setIsLoading(true)

    try {
      const newPost = addPost(data)
      router.push(`/blog/${newPost.id}`)
    } catch (error) {
      console.error("Error creating post:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <BlogForm onSubmit={handleSubmit} isLoading={isLoading} submitLabel="Publish Post" />
      </main>
    </div>
  )
}
