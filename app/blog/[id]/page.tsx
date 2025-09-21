"use client"

import { Header } from "@/components/header"
import { useBlogStore } from "@/hooks/use-blog-store"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Calendar, User, Edit, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import type { BlogPost } from "@/lib/blog-store"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface BlogPageProps {
  params: {
    id: string
  }
}

export default function BlogPage({ params }: BlogPageProps) {
  const { getPost, deletePost } = useBlogStore()
  const router = useRouter()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const foundPost = getPost(params.id)
    if (foundPost) {
      setPost(foundPost)
    }
  }, [params.id, getPost])

  const handleDelete = async () => {
    if (!post) return

    setIsDeleting(true)
    const success = deletePost(post.id)
    if (success) {
      router.push("/blogs")
    }
    setIsDeleting(false)
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto py-8 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
            <p className="text-muted-foreground mb-6">The blog post you're looking for doesn't exist.</p>
            <Button asChild>
              <Link href="/blogs">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blogs
              </Link>
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Navigation */}
          <div className="flex items-center justify-between mb-8">
            <Button asChild variant="ghost">
              <Link href="/blogs">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blogs
              </Link>
            </Button>

            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href={`/edit/${post.id}`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive bg-transparent"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{post.title}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {/* Blog Post */}
          <article>
            <Card>
              <CardContent>
                {/* Featured Image */}
                {post.image && (
                  <div className="relative h-64 md:h-96 w-full mb-8 rounded-lg overflow-hidden">
                    <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold mb-6 font-[family-name:var(--font-playfair)] text-balance">
                  {post.title}
                </h1>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8 pb-8 border-b">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    <span className="font-medium">{post.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    <span>Published {post.createdAt.toLocaleDateString()}</span>
                  </div>
                  {post.updatedAt.getTime() !== post.createdAt.getTime() && (
                    <div className="flex items-center gap-2">
                      <span>Updated {post.updatedAt.toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="prose prose-lg max-w-none">
                  {post.content.split("\n").map((paragraph, index) => (
                    <p key={index} className="mb-6 leading-relaxed text-pretty">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          </article>

          {/* Call to Action */}
          <div className="mt-12 text-center">
            <Card className="bg-muted/30">
              <CardContent>
                <h3 className="text-2xl font-bold mb-4 font-[family-name:var(--font-playfair)]">
                  Ready to Share Your Story?
                </h3>
                <p className="text-muted-foreground mb-6">
                  Join thousands of writers who trust PostQuell to share their thoughts with the world.
                </p>
                <Button asChild size="lg">
                  <Link href="/create">Start Writing Today</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
