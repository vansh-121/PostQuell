"use client"

export interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  image?: string
  author: string
  createdAt: Date
  updatedAt: Date
  tags: string[]
}

class BlogStore {
  private posts: BlogPost[] = []
  private listeners: (() => void)[] = []

  constructor() {
    // Load from localStorage if available
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("postquell-blogs")
      if (stored) {
        this.posts = JSON.parse(stored).map((post: any) => ({
          ...post,
          createdAt: new Date(post.createdAt),
          updatedAt: new Date(post.updatedAt),
        }))
      } else {
        // Add some sample posts
        this.posts = [
          {
            id: "1",
            title: "Welcome to PostQuell",
            content:
              "PostQuell is a modern blogging platform designed for content creators who want to share their stories with the world. With our intuitive interface and powerful features, you can focus on what matters most - creating amazing content.",
            excerpt: "Discover the future of blogging with PostQuell - where creativity meets simplicity.",
            image: "/modern-blogging-platform-hero-image.jpg",
            author: "PostQuell Team",
            createdAt: new Date("2024-01-15"),
            updatedAt: new Date("2024-01-15"),
            tags: ["welcome", "blogging", "platform"],
          },
          {
            id: "2",
            title: "The Art of Storytelling in Digital Age",
            content:
              "In today's digital landscape, storytelling has evolved beyond traditional boundaries. We explore how modern content creators are reshaping narratives and connecting with audiences in meaningful ways.",
            excerpt: "Exploring how digital platforms are transforming the way we tell and consume stories.",
            image: "/digital-storytelling-creative-writing.jpg",
            author: "Sarah Johnson",
            createdAt: new Date("2024-01-10"),
            updatedAt: new Date("2024-01-10"),
            tags: ["storytelling", "digital", "content"],
          },
        ]
        this.save()
      }
    }
  }

  private save() {
    if (typeof window !== "undefined") {
      localStorage.setItem("postquell-blogs", JSON.stringify(this.posts))
    }
  }

  private notify() {
    this.listeners.forEach((listener) => listener())
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  getAllPosts(): BlogPost[] {
    return [...this.posts].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  getPost(id: string): BlogPost | undefined {
    return this.posts.find((post) => post.id === id)
  }

  addPost(post: Omit<BlogPost, "id" | "createdAt" | "updatedAt">): BlogPost {
    const newPost: BlogPost = {
      ...post,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.posts.push(newPost)
    this.save()
    this.notify()
    return newPost
  }

  updatePost(id: string, updates: Partial<Omit<BlogPost, "id" | "createdAt">>): BlogPost | null {
    const index = this.posts.findIndex((post) => post.id === id)
    if (index === -1) return null

    this.posts[index] = {
      ...this.posts[index],
      ...updates,
      updatedAt: new Date(),
    }
    this.save()
    this.notify()
    return this.posts[index]
  }

  deletePost(id: string): boolean {
    const index = this.posts.findIndex((post) => post.id === id)
    if (index === -1) return false

    this.posts.splice(index, 1)
    this.save()
    this.notify()
    return true
  }
}

export const blogStore = new BlogStore()
