import { Header } from "@/components/header"
import { BlogGrid } from "@/components/blog-grid"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PenTool, Sparkles, Users, Zap } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative py-24 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 tracking-tight">
            Share Your <span className="text-primary">Stories</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            PostQuell is the modern blogging platform where creativity meets simplicity. Write, edit, and share your
            thoughts with the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-base px-8 h-12 rounded-xl">
              <Link href="/create">
                <PenTool className="mr-2 h-5 w-5" />
                Start Writing
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base px-8 h-12 rounded-xl bg-transparent">
              <Link href="/blogs">Explore Blogs</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 tracking-tight">Why Choose PostQuell?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Beautiful Design</h3>
              <p className="text-muted-foreground leading-relaxed">
                Clean, modern interface that puts your content first
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-chart-2/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-chart-2/20 transition-colors">
                <Zap className="h-8 w-8 text-chart-2" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
              <p className="text-muted-foreground leading-relaxed">Optimized for speed and performance</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-chart-3/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-chart-3/20 transition-colors">
                <Users className="h-8 w-8 text-chart-3" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Community Focused</h3>
              <p className="text-muted-foreground leading-relaxed">Connect with fellow writers and readers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Blogs Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold tracking-tight">Recent Posts</h2>
            <Button asChild variant="outline" className="rounded-xl bg-transparent">
              <Link href="/blogs">View All</Link>
            </Button>
          </div>
          <BlogGrid limit={6} />
        </div>
      </section>
    </div>
  )
}
