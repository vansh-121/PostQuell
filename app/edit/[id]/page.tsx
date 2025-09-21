"use client"

import { Header } from "@/components/header"
import { BlogForm } from "@/components/blog-form"
import { useBlogStore } from "@/hooks/use-blog-store"
import { blogStore } from "@/lib/blog-store"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import type { BlogPost } from "@/lib/blog-store"

interface EditPageProps {
  params: {
    id: string
  }
}

export default function EditPage({ params }: EditPageProps) {
  const { updatePost, getPost } = useBlogStore()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [post, setPost] = useState<BlogPost | null>(null)

  useEffect(() => {
    const foundPost = getPost(params.id)
    if (foundPost) {
      setPost(foundPost)
    } else {
      router.push("/blogs")
    }
  }, [params.id, getPost, router])

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
      const updatedPost = updatePost(params.id, data)
      if (updatedPost) {
        if (blogStore.getLastSaveStrippedImages && blogStore.getLastSaveStrippedImages()) {
          alert(
            "The post was updated but the featured image could not be saved due to browser storage limits. The image was removed from the saved post."
          )
        }
        router.push(`/blog/${updatedPost.id}`)
      }
    } catch (error) {
      console.error("Error updating post:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto py-8 px-4">
          <div className="text-center">
            <p>Loading...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <BlogForm initialData={post} onSubmit={handleSubmit} isLoading={isLoading} submitLabel="Update Post" />
      </main>
    </div>
  )
}
