"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Calendar, 
  UserIcon, 
  Clock, 
  Eye, 
  Share2, 
  Bookmark, 
  Tag, 
  Search, 
  Filter, 
  Loader2,
  Plus,
  Edit,
  Trash2,
  Send,
  MessageSquare,
  ThumbsUp,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import Link from "next/link"

interface BlogPost {
  _id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  category: string
  readTime: string
  views: number
  image: string
  featured: boolean
  tags: string[]
  published: boolean
  createdAt: string
  updatedAt: string
}

interface Comment {
  _id: string
  name: string
  email: string
  content: string
  createdAt: string
}

interface BlogFormData {
  _id?: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  category: string
  readTime: string
  image: string
  tags: string[]
  featured: boolean
  published: boolean
}

const categories = ["All", "Craftsmanship", "Health & Wellness", "Seasonal Offers", "Science", "Sustainability", "Stories"]
const tagsList = ["Traditional", "Recipe", "Health", "Festival", "Science", "Eco-friendly", "Stories", "Heritage"]

// Initial form data
const initialFormData: BlogFormData = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  author: "",
  category: "Craftsmanship",
  readTime: "5 min read",
  image: "/blog-ladoo.jpg",
  tags: [],
  featured: false,
  published: true
}

// Convert BlogPost to BlogFormData
const blogPostToFormData = (post: BlogPost): BlogFormData => ({
  _id: post._id,
  title: post.title,
  slug: post.slug,
  excerpt: post.excerpt,
  content: post.content,
  author: post.author,
  category: post.category,
  readTime: post.readTime,
  image: post.image,
  tags: post.tags,
  featured: post.featured,
  published: post.published
})

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [commentForm, setCommentForm] = useState({ name: "", email: "", content: "" })
  const [commentLoading, setCommentLoading] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [blogForm, setBlogForm] = useState<BlogFormData>(initialFormData)

  useEffect(() => {
    fetchBlogPosts()
  }, [])

  const fetchBlogPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/blog')
      const data = await response.json()
      
      if (data.success) {
        setBlogPosts(data.data)
        // Find featured post
        const featured = data.data.find((post: BlogPost) => post.featured)
        setFeaturedPost(featured || data.data[0])
      } else {
        toast.error('Failed to load blog posts')
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error)
      toast.error('Failed to load blog posts')
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async (postId: string) => {
    try {
      const response = await fetch(`/api/blog/${postId}/comments`)
      const data = await response.json()
      
      if (data.success) {
        setComments(data.data)
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }

  const handleSelectPost = async (post: BlogPost) => {
    setSelectedPost(post)
    fetchComments(post._id)
    
    // Increment views
    try {
      await fetch(`/api/blog/${post._id}/views`, {
        method: 'PUT'
      })
    } catch (error) {
      console.error('Error updating views:', error)
    }
  }

  const handleClosePost = () => {
    setSelectedPost(null)
    setComments([])
  }

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPost || !commentForm.name || !commentForm.email || !commentForm.content) {
      toast.error('Please fill all fields')
      return
    }

    setCommentLoading(true)
    try {
      const response = await fetch(`/api/blog/${selectedPost._id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentForm)
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success('Comment added successfully!')
        setComments(prev => [data.data, ...prev])
        setCommentForm({ name: "", email: "", content: "" })
      } else {
        toast.error(data.error || 'Failed to add comment')
      }
    } catch (error) {
      console.error('Error adding comment:', error)
      toast.error('Failed to add comment')
    } finally {
      setCommentLoading(false)
    }
  }

  const handleAddBlogPost = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!blogForm.title || !blogForm.excerpt || !blogForm.content) {
      toast.error('Please fill all required fields')
      return
    }

    // Generate slug from title if not provided
    const slug = blogForm.slug || blogForm.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')

    // Create blog data without _id for POST requests
    const blogData: Omit<BlogFormData, '_id'> = {
      title: blogForm.title,
      slug,
      excerpt: blogForm.excerpt,
      content: blogForm.content,
      author: blogForm.author,
      category: blogForm.category,
      readTime: blogForm.readTime || `${Math.ceil(blogForm.content.split(' ').length / 200)} min read`,
      image: blogForm.image,
      tags: blogForm.tags,
      featured: blogForm.featured,
      published: blogForm.published
    }

    try {
      // For edit mode, use the _id
      const url = editMode && blogForm._id ? `/api/blog/${blogForm._id}` : '/api/blog'
      const method = editMode ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blogData)
      })

      const data = await response.json()

      if (!data.success) {
        toast.error(data.error || `Failed to ${editMode ? 'update' : 'add'} blog post`)
        return
      }

      toast.success(`Blog post ${editMode ? 'updated' : 'added'} successfully!`)
      resetBlogForm()
      fetchBlogPosts()
    } catch (error) {
      console.error('Error saving blog post:', error)
      toast.error(`Failed to ${editMode ? 'update' : 'add'} blog post`)
    }
  }

  const handleDeleteBlogPost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return

    try {
      const response = await fetch(`/api/blog/${postId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (!data.success) {
        toast.error(data.error || 'Failed to delete blog post')
        return
      }

      toast.success('Blog post deleted!')
      if (selectedPost?._id === postId) {
        handleClosePost()
      }
      fetchBlogPosts()
    } catch (error) {
      console.error('Error deleting blog post:', error)
      toast.error('Failed to delete blog post')
    }
  }

  const handleEditBlogPost = (post: BlogPost) => {
    setBlogForm(blogPostToFormData(post))
    setEditMode(true)
    setShowAddForm(true)
  }

  const resetBlogForm = () => {
    setBlogForm(initialFormData)
    setEditMode(false)
    setShowAddForm(false)
  }

  const toggleTag = (tag: string) => {
    setBlogForm(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }))
  }

  const toggleFilterTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const filteredPosts = blogPosts.filter(post => {
    if (!post.published) return false
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => post.tags.includes(tag))
    const matchesSearch = searchTerm === "" || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    return matchesCategory && matchesTags && matchesSearch
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const getReadTime = (content: string) => {
    const wordCount = content.split(' ').length
    const minutes = Math.ceil(wordCount / 200)
    return `${minutes} min read`
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
              <p className="text-muted-foreground mt-4">Loading blog posts...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  // Blog Post Detail View
  if (selectedPost) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background">
          {/* Back Button */}
          <div className="max-w-7xl mx-auto px-4 py-6">
            <Button
              variant="ghost"
              onClick={handleClosePost}
              className="mb-4"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </div>

          {/* Blog Post Detail */}
          <article className="max-w-4xl mx-auto px-4 py-8">
            <Card className="overflow-hidden">
              {/* Featured Image */}
              <div className="relative h-64 md:h-96 overflow-hidden">
                <Image
                  src={selectedPost.image || "/placeholder.svg"}
                  alt={selectedPost.title}
                  fill
                  className="object-cover"
                  priority
                />
                {selectedPost.featured && (
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full font-medium text-sm">
                      Featured
                    </span>
                  </div>
                )}
              </div>

              {/* Post Content */}
              <div className="p-6 md:p-8">
                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-muted-foreground">
                  <span className="px-3 py-1 bg-secondary/20 text-primary rounded-full font-medium">
                    {selectedPost.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {formatDate(selectedPost.createdAt)}
                  </div>
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4" />
                    {selectedPost.author}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {selectedPost.readTime}
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    {selectedPost.views.toLocaleString()} views
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold font-serif text-primary mb-6">
                  {selectedPost.title}
                </h1>

                {/* Excerpt */}
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  {selectedPost.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {selectedPost.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="px-3 py-1 bg-secondary/20 text-sm rounded-full hover:bg-secondary/30 transition-colors cursor-pointer"
                      onClick={() => toggleFilterTag(tag)}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Content */}
                <div className="prose prose-lg max-w-none mb-8">
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {selectedPost.content}
                  </div>
                </div>

                {/* Share Section */}
                <div className="border-t border-b py-6 my-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold mb-2">Share this article</h3>
                      <p className="text-sm text-muted-foreground">
                        Help spread the sweet knowledge
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                      <Button variant="outline" size="sm">
                        <Bookmark className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Comments Section */}
                <div className="space-y-8">
                  <h3 className="text-2xl font-bold">Comments ({comments.length})</h3>
                  
                  {/* Add Comment Form */}
                  <Card className="p-6">
                    <h4 className="font-bold mb-4">Leave a Comment</h4>
                    <form onSubmit={handleAddComment} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Name *</label>
                          <Input
                            value={commentForm.name}
                            onChange={(e) => setCommentForm({...commentForm, name: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Email *</label>
                          <Input
                            type="email"
                            value={commentForm.email}
                            onChange={(e) => setCommentForm({...commentForm, email: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Comment *</label>
                        <Textarea
                          value={commentForm.content}
                          onChange={(e) => setCommentForm({...commentForm, content: e.target.value})}
                          rows={4}
                          required
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="bg-primary hover:bg-primary/90"
                        disabled={commentLoading}
                      >
                        {commentLoading ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4 mr-2" />
                        )}
                        Post Comment
                      </Button>
                    </form>
                  </Card>

                  {/* Comments List */}
                  <div className="space-y-6">
                    {comments.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <MessageSquare className="w-12 h-12 mx-auto opacity-50 mb-3" />
                        <p>No comments yet. Be the first to comment!</p>
                      </div>
                    ) : (
                      comments.map((comment) => (
                        <div key={comment._id} className="border-b pb-6 last:border-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-bold">{comment.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(comment.createdAt)}
                              </p>
                            </div>
                            <Button variant="ghost" size="sm">
                              <ThumbsUp className="w-4 h-4" />
                            </Button>
                          </div>
                          <p className="text-muted-foreground">{comment.content}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </article>
        </main>
        <Footer />
      </>
    )
  }

  // Admin Add/Edit Blog Post Form
  if (showAddForm) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {editMode ? 'Edit Blog Post' : 'Add New Blog Post'}
                </h2>
                <Button variant="ghost" onClick={resetBlogForm}>
                  Cancel
                </Button>
              </div>

              <form onSubmit={handleAddBlogPost} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title *</label>
                    <Input
                      value={blogForm.title}
                      onChange={(e) => setBlogForm({...blogForm, title: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Slug</label>
                    <Input
                      value={blogForm.slug}
                      onChange={(e) => setBlogForm({...blogForm, slug: e.target.value})}
                      placeholder="auto-generated from title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Author</label>
                    <Input
                      value={blogForm.author}
                      onChange={(e) => setBlogForm({...blogForm, author: e.target.value})}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      value={blogForm.category}
                      onChange={(e) => setBlogForm({...blogForm, category: e.target.value})}
                      className="w-full px-3 py-2 border border-input rounded-md"
                    >
                      {categories.filter(c => c !== 'All').map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Read Time</label>
                    <Input
                      value={blogForm.readTime}
                      onChange={(e) => setBlogForm({...blogForm, readTime: e.target.value})}
                      placeholder="e.g., 5 min read"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Image URL</label>
                    <Input
                      value={blogForm.image}
                      onChange={(e) => setBlogForm({...blogForm, image: e.target.value})}
                      placeholder="/blog-image.jpg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Excerpt *</label>
                  <Textarea
                    value={blogForm.excerpt}
                    onChange={(e) => setBlogForm({...blogForm, excerpt: e.target.value})}
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Content *</label>
                  <Textarea
                    value={blogForm.content}
                    onChange={(e) => {
                      setBlogForm({...blogForm, content: e.target.value})
                      if (!blogForm.readTime) {
                        setBlogForm(prev => ({
                          ...prev,
                          readTime: getReadTime(e.target.value)
                        }))
                      }
                    }}
                    rows={10}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {tagsList.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          blogForm.tags.includes(tag)
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary/20 hover:bg-secondary/30'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {blogForm.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                        {tag} ×
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={blogForm.featured}
                      onChange={(e) => setBlogForm({...blogForm, featured: e.target.checked})}
                      className="w-4 h-4"
                    />
                    <span>Featured Post</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={blogForm.published}
                      onChange={(e) => setBlogForm({...blogForm, published: e.target.checked})}
                      className="w-4 h-4"
                    />
                    <span>Published</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Button type="submit" className="bg-primary hover:bg-primary/90">
                    {editMode ? 'Update Post' : 'Add Post'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetBlogForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  // Main Blog Listing Page
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
                          {formatDate(featuredPost.createdAt)}
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
                          <span>{featuredPost.views.toLocaleString()} views</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-4 pt-4">
                        <Button 
                          className="bg-primary hover:bg-primary/90"
                          onClick={() => handleSelectPost(featuredPost)}
                        >
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
                        onClick={() => toggleFilterTag(tag)}
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

                {/* Admin Controls */}
                <Card className="p-6 border-primary/20">
                  <div className="space-y-3">
                    <h3 className="font-bold text-lg">Admin Tools</h3>
                    <Button 
                      onClick={() => setShowAddForm(true)}
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Post
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Only visible to admin users
                    </p>
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
                      <Card key={post._id} className="overflow-hidden group hover:shadow-xl transition-all duration-300">
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
                          {/* Admin Controls Overlay */}
                          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="icon"
                              variant="secondary"
                              className="w-8 h-8 bg-background/80 backdrop-blur-sm"
                              onClick={() => handleEditBlogPost(post)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="secondary"
                              className="w-8 h-8 bg-background/80 backdrop-blur-sm text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteBlogPost(post._id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="p-6 space-y-4">
                          <div className="space-y-3">
                            <h3 
                              className="text-xl font-bold font-serif text-primary group-hover:text-secondary transition-colors line-clamp-2 cursor-pointer"
                              onClick={() => handleSelectPost(post)}
                            >
                              {post.title}
                            </h3>
                            <p className="text-muted-foreground line-clamp-2">
                              {post.excerpt}
                            </p>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {post.tags.slice(0, 3).map((tag) => (
                              <span 
                                key={tag} 
                                className="px-2 py-1 bg-secondary/20 text-xs rounded hover:bg-secondary/30 transition-colors cursor-pointer"
                                onClick={() => toggleFilterTag(tag)}
                              >
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
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(post.createdAt)}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleSelectPost(post)}
                              >
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