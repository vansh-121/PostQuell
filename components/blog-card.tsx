"use client"

import type { BlogPost } from "@/lib/blog-store"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, Edit, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useBlogStore } from "@/hooks/use-blog-store"
import { useState } from "react"
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

interface BlogCardProps {
  post: BlogPost
  showActions?: boolean
}

export function BlogCard({ post, showActions = false }: BlogCardProps) {
  const { deletePost } = useBlogStore()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    deletePost(post.id)
    setIsDeleting(false)
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {post.image && (
        <div className="relative h-48 w-full">
          <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
        </div>
      )}

      <CardHeader>
        <div className="flex flex-wrap gap-2 mb-2">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <h3 className="text-xl font-bold font-[family-name:var(--font-playfair)] line-clamp-2">{post.title}</h3>
      </CardHeader>

      <CardContent>
        <p className="text-muted-foreground line-clamp-3 mb-4">{post.excerpt}</p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{post.createdAt.toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button asChild variant="outline">
          <Link href={`/blog/${post.id}`}>Read More</Link>
        </Button>

        {showActions && (
          <div className="flex gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href={`/edit/${post.id}`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
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
        )}
      </CardFooter>
    </Card>
  )
}
