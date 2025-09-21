"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Upload, Eye, EyeOff } from "lucide-react"
import type { BlogPost } from "@/lib/blog-store"
import Image from "next/image"

interface BlogFormProps {
  initialData?: Partial<BlogPost>
  onSubmit: (data: {
    title: string
    content: string
    excerpt: string
    image?: string
    author: string
    tags: string[]
  }) => void
  isLoading?: boolean
  submitLabel?: string
}

export function BlogForm({ initialData, onSubmit, isLoading = false, submitLabel = "Publish Post" }: BlogFormProps) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [content, setContent] = useState(initialData?.content || "")
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "")
  const [author, setAuthor] = useState(initialData?.author || "")
  const [image, setImage] = useState(initialData?.image || "")
  const [tags, setTags] = useState<string[]>(initialData?.tags || [])
  const [tagInput, setTagInput] = useState("")
  const [isPreview, setIsPreview] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Compress/resize the image before storing as data URL to avoid large localStorage usage
    const compressImage = async (file: File, maxWidth = 1200, maxHeight = 800, quality = 0.8) => {
      try {
        if (typeof createImageBitmap === "function") {
          const bitmap = await createImageBitmap(file)
          const ratio = Math.min(maxWidth / bitmap.width, maxHeight / bitmap.height, 1)
          const width = Math.round(bitmap.width * ratio)
          const height = Math.round(bitmap.height * ratio)

          const canvas = document.createElement("canvas")
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext("2d")
          if (!ctx) throw new Error("Could not get canvas context")
          ctx.drawImage(bitmap, 0, 0, width, height)
          return canvas.toDataURL("image/jpeg", quality)
        }

        // Fallback for older browsers
        return await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(file)
        })
      } catch (err) {
        // If compression fails, fallback to original file as data URL
        return await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(file)
        })
      }
    }

      ; (async () => {
        try {
          const dataUrl = await compressImage(file)
          setImage(dataUrl)
        } catch (err) {
          console.error("Error processing image:", err)
        }
      })()
  }

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !content.trim() || !author.trim()) {
      return
    }

    const excerptText = excerpt.trim() || content.substring(0, 150) + "..."

    onSubmit({
      title: title.trim(),
      content: content.trim(),
      excerpt: excerptText,
      image: image || undefined,
      author: author.trim(),
      tags,
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.target === document.querySelector('input[placeholder="Add tags..."]')) {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-[family-name:var(--font-playfair)]">
          {initialData?.id ? "Edit Post" : "Create New Post"}
        </h1>
        <Button type="button" variant="outline" onClick={() => setIsPreview(!isPreview)}>
          {isPreview ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
          {isPreview ? "Edit" : "Preview"}
        </Button>
      </div>

      {isPreview ? (
        <Card>
          <CardContent>
            {image && (
              <div className="relative h-64 w-full mb-6 rounded-lg overflow-hidden">
                {/* Next/Image may attempt optimization which doesn't work well with data URLs; use <img> for data URLs */}
                {image.startsWith("data:") ? (
                  // plain img for data URLs
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={image} alt={title} className="w-full h-64 object-cover rounded-lg" />
                ) : (
                  <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="text-4xl font-bold mb-4 font-[family-name:var(--font-playfair)]">
              {title || "Your Blog Title"}
            </h1>

            <p className="text-muted-foreground mb-6 text-lg">
              By {author || "Author Name"} • {new Date().toLocaleDateString()}
            </p>

            <div className="prose prose-lg max-w-none">
              {content.split("\n").map((paragraph, index) => (
                <p key={index} className="mb-4 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter your blog title..."
                  required
                  className="text-lg"
                />
              </div>

              <div>
                <Label htmlFor="author">Author *</Label>
                <Input
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Your name..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief description of your post (optional - will auto-generate if empty)..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {image && (
                  <div className="relative h-48 w-full rounded-lg overflow-hidden">
                    {image.startsWith("data:") ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={image} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                    ) : (
                      <Image src={image || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                    )}
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => setImage("")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="h-4 w-4 mr-2" />
                    {image ? "Change Image" : "Upload Image"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-destructive">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add tags..."
                    className="flex-1"
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content *</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your blog content here..."
                required
                rows={15}
                className="resize-none"
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline">
              Save Draft
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Publishing..." : submitLabel}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
