"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Calendar, UserIcon } from "lucide-react"

const blogPosts = [
  {
    id: 1,
    title: "The Art of Making Traditional Ladoo",
    excerpt: "Discover the centuries-old techniques behind our signature Kanakchur Muri Ladoo...",
    date: "2024-01-15",
    author: "Chef Ravi Kumar",
    category: "Craftsmanship",
  },
  {
    id: 2,
    title: "Nutrition and Health Benefits of Our Sweets",
    excerpt: "Learn about the nutritional value and health benefits of our carefully crafted recipes...",
    date: "2024-01-10",
    author: "Dr. Anjali Sharma",
    category: "Health",
  },
  {
    id: 3,
    title: "Celebrating Festival Season with GramoOrja",
    excerpt: "Special offers and gift bundles for all your festival celebrations this season...",
    date: "2024-01-05",
    author: "Marketing Team",
    category: "Offers",
  },
]

export default function BlogPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="py-16 px-4 bg-gradient-to-b from-secondary/10 to-transparent">
          <div className="max-w-7xl mx-auto text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold font-serif text-primary">Blog</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Stories, recipes, and insights from the world of traditional sweets
            </p>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-1 gap-8">
            {blogPosts.map((post) => (
              <Card key={post.id} className="p-8 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="px-3 py-1 bg-secondary/20 text-primary rounded-full font-medium">
                      {post.category}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold font-serif text-primary">{post.title}</h2>
                  <p className="text-foreground leading-relaxed">{post.excerpt}</p>
                  <div className="flex items-center gap-6 pt-4 text-sm text-muted-foreground border-t">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-4 h-4" />
                      {post.author}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
