"use client"

import { useState, useEffect } from "react"
import { blogStore, type BlogPost } from "@/lib/blog-store"

export function useBlogStore() {
  const [posts, setPosts] = useState<BlogPost[]>([])

  useEffect(() => {
    setPosts(blogStore.getAllPosts())

    const unsubscribe = blogStore.subscribe(() => {
      setPosts(blogStore.getAllPosts())
    })

    return unsubscribe
  }, [])

  return {
    posts,
    addPost: blogStore.addPost.bind(blogStore),
    updatePost: blogStore.updatePost.bind(blogStore),
    deletePost: blogStore.deletePost.bind(blogStore),
    getPost: blogStore.getPost.bind(blogStore),
  }
}
