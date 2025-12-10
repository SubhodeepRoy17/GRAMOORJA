"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, UserIcon, Clock, Eye, Share2, Bookmark, Tag, Search, Filter } from "lucide-react"
import Image from "next/image"

const blogPosts = [
  {
    id: 1,
    title: "The Art of Making Traditional Ladoo: A Journey Through Centuries",
    excerpt: "Discover the centuries-old techniques and secret ingredients behind our signature Kanakchur Muri Ladoo. Learn how tradition meets innovation in our kitchen.",
    date: "2024-01-15",
    author: "Chef Ravi Kumar",
    category: "Craftsmanship",
    readTime: "8 min read",
    views: "1.2K",
    image: "./blog-ladoo.jpg",
    featured: true,
    tags: ["Traditional", "Recipe", "Heritage"]
  },
  {
    id: 2,
    title: "Nutrition and Health Benefits of Traditional Sweets",
    excerpt: "Contrary to popular belief, traditional sweets made with natural ingredients offer surprising health benefits. Discover the nutritional value of our recipes.",
    date: "2024-01-10",
    author: "Dr. Anjali Sharma",
    category: "Health & Wellness",
    readTime: "6 min read",
    views: "890",
    image: "./blog-health.jpg",
    featured: false,
    tags: ["Health", "Nutrition", "Wellness"]
  },
  {
    id: 3,
    title: "Celebrating Festival Season with Ghoroa Delights",
    excerpt: "Special offers, gift bundles, and festival collections for all your celebrations. Make this season sweeter with our exclusive offerings.",
    date: "2024-01-05",
    author: "Marketing Team",
    category: "Seasonal Offers",
    readTime: "4 min read",
    views: "1.5K",
    image: "./blog-festival.jpg",
    featured: false,
    tags: ["Festival", "Offers", "Gifting"]
  },
  {
    id: 4,
    title: "The Science Behind Perfect Sweetness Balance",
    excerpt: "How we achieve the perfect sweetness balance using natural ingredients and traditional techniques. No artificial sweeteners, just pure taste.",
    date: "2023-12-28",
    author: "Food Scientist Meera",
    category: "Science",
    readTime: "7 min read",
    views: "650",
    image: "./blog-science.jpg",
    featured: false,
    tags: ["Science", "Ingredients", "Quality"]
  },
  {
    id: 5,
    title: "Sustainable Packaging: Our Commitment to the Planet",
    excerpt: "Learn about our eco-friendly packaging initiatives and how we're reducing our environmental footprint while delivering freshness.",
    date: "2023-12-20",
    author: "Sustainability Team",
    category: "Sustainability",
    readTime: "5 min read",
    views: "420",
    image: "./blog-packaging.jpg",
    featured: false,
    tags: ["Eco-friendly", "Packaging", "Sustainability"]
  },
  {
    id: 6,
    title: "Customer Stories: Sweet Memories Made",
    excerpt: "Heartwarming stories from our customers who've made special moments sweeter with Ghoroa Delights. Read their experiences.",
    date: "2023-12-15",
    author: "Community Team",
    category: "Stories",
    readTime: "10 min read",
    views: "2.1K",
    image: "./blog-stories.jpg",
    featured: true,
    tags: ["Stories", "Community", "Reviews"]
  }
]

const categories = ["All", "Craftsmanship", "Health & Wellness", "Seasonal Offers", "Science", "Sustainability", "Stories"]
const tagsList = ["Traditional", "Recipe", "Health", "Festival", "Science", "Eco-friendly", "Stories", "Heritage"]

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => post.tags.includes(tag))
    const matchesSearch = searchTerm === "" || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesCategory && matchesTags && matchesSearch
  })

  const featuredPost = blogPosts.find(post => post.featured)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 px-4 bg-gradient-to-br from-primary/5 via-background to-secondary/5 overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium">
                <Tag className="w-4 h-4" />
                Sweet Insights & Stories
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-serif text-primary">
                The <span className="text-secondary">Sweet</span> Blog
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Stories, recipes, and insights from the world of traditional sweets. 
                Learn about our craft, ingredients, and the heritage behind every bite.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Post */}
        {featuredPost && (
          <section className="py-12 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-3xl font-bold font-serif text-primary">Featured Story</h2>
                <div className="text-sm text-muted-foreground">🔥 Trending Now</div>
              </div>
              
              <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 group cursor-pointer">
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="relative h-64 lg:h-full min-h-[400px] overflow-hidden">
                    <Image
                      src={featuredPost.image || "/placeholder.svg"}
                      alt={featuredPost.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full font-medium text-sm">
                        Featured
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                        <span className="px-3 py-1 bg-secondary/20 text-primary rounded-full font-medium">
                          {featuredPost.category}
                        </span>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(featuredPost.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                      </div>
                      
                      <h2 className="text-3xl font-bold font-serif text-primary group-hover:text-secondary transition-colors">
                        {featuredPost.title}
                      </h2>
                      
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        {featuredPost.excerpt}
                      </p>
                      
                      <div className="flex items-center gap-6 pt-4 border-t">
                        <div className="flex items-center gap-2">
                          <UserIcon className="w-4 h-4" />
                          <span className="font-medium">{featuredPost.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{featuredPost.readTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          <span>{featuredPost.views} views</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-4 pt-4">
                        <Button className="bg-primary hover:bg-primary/90">
                          Read Full Story
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Bookmark className="w-5 h-5" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Share2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </section>
        )}

        {/* Blog Content */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-8">
                {/* Search */}
                <Card className="p-6">
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <Search className="w-5 h-5" />
                      Search Articles
                    </h3>
                    <Input
                      placeholder="Search blog posts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </Card>

                {/* Categories */}
                <Card className="p-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Categories
                  </h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedCategory === category
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-secondary/20'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </Card>

                {/* Tags */}
                <Card className="p-6">
                  <h3 className="font-bold text-lg mb-4">Popular Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {tagsList.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          selectedTags.includes(tag)
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary/20 hover:bg-secondary/30'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </Card>

                {/* Newsletter */}
                <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg">Sweet Updates</h3>
                    <p className="text-sm text-muted-foreground">
                      Subscribe to get the latest stories and offers
                    </p>
                    <div className="space-y-3">
                      <Input placeholder="Your email" />
                      <Button className="w-full bg-primary hover:bg-primary/90">
                        Subscribe
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Blog Posts Grid */}
              <div className="lg:col-span-3">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold font-serif text-primary">
                    {filteredPosts.length} Articles Found
                  </h3>
                  <p className="text-muted-foreground">
                    Filtered by {selectedCategory !== "All" ? `"${selectedCategory}"` : "all categories"} 
                    {selectedTags.length > 0 && ` and ${selectedTags.length} tag(s)`}
                  </p>
                </div>

                {filteredPosts.length === 0 ? (
                  <div className="text-center py-16">
                    <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                      No articles found
                    </h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search or filters
                    </p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-8">
                    {filteredPosts.filter(p => !p.featured).map((post) => (
                      <Card key={post.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer">
                        <div className="aspect-video relative overflow-hidden">
                          <Image
                            src={post.image || "/placeholder.svg"}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-primary/90 text-primary-foreground rounded-full font-medium text-sm">
                              {post.category}
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-6 space-y-4">
                          <div className="space-y-3">
                            <h3 className="text-xl font-bold font-serif text-primary group-hover:text-secondary transition-colors line-clamp-2">
                              {post.title}
                            </h3>
                            <p className="text-muted-foreground line-clamp-2">
                              {post.excerpt}
                            </p>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {post.tags.slice(0, 3).map((tag) => (
                              <span key={tag} className="px-2 py-1 bg-secondary/20 text-xs rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-between pt-4 border-t">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <UserIcon className="w-4 h-4" />
                                <span>{post.author}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{post.readTime}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="ghost">
                                Read
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold font-serif text-primary">
                Want to Share Your Sweet Story?
              </h2>
              <p className="text-xl text-muted-foreground">
                We're always looking for passionate writers and sweet enthusiasts to contribute to our blog.
              </p>
            </div>
            <Button size="lg" className="bg-primary hover:bg-primary/90 px-8">
              Become a Contributor
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}