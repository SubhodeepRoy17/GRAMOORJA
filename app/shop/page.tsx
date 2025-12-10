"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Star, Search, Filter, Plus, Minus } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

interface Product {
  id: number
  name: string
  price: number
  weight: string
  rating: number
  reviews: number
  description: string
  image: string
  category?: string
}

interface CartItem extends Product {
  quantity: number
}

const products: Product[] = [
  {
    id: 1,
    name: "Premium Kanakchur Muri Ladoo",
    price: 299,
    weight: "500g",
    rating: 4.8,
    reviews: 156,
    description: "Traditional handcrafted sweets",
    image: "/laddoo.jpg",
    category: "ladoo"
  },
  {
    id: 2,
    name: "Deluxe Gift Box",
    price: 599,
    weight: "1kg",
    rating: 4.9,
    reviews: 89,
    description: "Perfect for celebrations",
    image: "/laddoo.jpg",
    category: "gift"
  },
  {
    id: 3,
    name: "Family Pack",
    price: 999,
    weight: "2kg",
    rating: 4.7,
    reviews: 234,
    description: "Best value for families",
    image: "/laddoo.jpg",
    category: "pack"
  },
  {
    id: 4,
    name: "Assorted Sweets",
    price: 449,
    weight: "750g",
    rating: 4.6,
    reviews: 112,
    description: "Mix of our finest varieties",
    image: "/laddoo.jpg",
    category: "assorted"
  },
  {
    id: 5,
    name: "Special Mithai Collection",
    price: 749,
    weight: "1.5kg",
    rating: 4.9,
    reviews: 178,
    description: "Exclusive festive collection",
    image: "/laddoo.jpg",
    category: "premium"
  },
  {
    id: 6,
    name: "Mini Ladoo Box",
    price: 199,
    weight: "250g",
    rating: 4.5,
    reviews: 98,
    description: "Perfect for small celebrations",
    image: "/laddoo.jpg",
    category: "ladoo"
  },
  {
    id: 7,
    name: "Corporate Gift Pack",
    price: 1299,
    weight: "3kg",
    rating: 4.8,
    reviews: 56,
    description: "Premium packaging for corporate gifting",
    image: "/laddoo.jpg",
    category: "gift"
  },
  {
    id: 8,
    name: "Sugar-Free Sweets",
    price: 399,
    weight: "500g",
    rating: 4.7,
    reviews: 203,
    description: "Healthy alternative without compromising taste",
    image: "/laddoo.jpg",
    category: "sugarfree"
  },
]

const categories = ["All", "ladoo", "gift", "pack", "assorted", "premium", "sugarfree"]

export default function ShopPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("default")

  // Initialize cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  const getProductQuantity = (productId: number) => {
    const cartItem = cart.find(item => item.id === productId)
    return cartItem ? cartItem.quantity : 0
  }

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id)
      let newCart
      
      if (existingItem) {
        newCart = prevCart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        newCart = [...prevCart, { ...product, quantity: 1 }]
      }
      
      toast.success(`${product.name} added to cart`)
      return newCart
    })
  }

  const removeFromCart = (productId: number) => {
    setCart(prevCart => {
      const newCart = prevCart
        .map(item => 
          item.id === productId 
            ? { ...item, quantity: Math.max(0, item.quantity - 1) }
            : item
        )
        .filter(item => item.quantity > 0)
      
      const product = products.find(p => p.id === productId)
      if (product) {
        toast.info(`${product.name} removed from cart`)
      }
      
      return newCart
    })
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      default:
        return 0
    }
  })

  const totalItemsInCart = cart.reduce((total, item) => total + item.quantity, 0)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-16 px-4 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="max-w-7xl mx-auto text-center space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-primary">
              Our Sweet Collection
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Handcrafted traditional sweets made with premium ingredients, delivered with love
            </p>
          </div>
        </section>

        {/* Shop Section */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Filters and Search */}
            <div className="mb-8 space-y-6">
              {/* Search Bar */}
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Search sweets by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Categories */}
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className="capitalize"
                    >
                      {category}
                    </Button>
                  ))}
                </div>

                {/* Sort */}
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent border rounded-md px-3 py-2 text-sm"
                  >
                    <option value="default">Sort by</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>

              {/* Results Info */}
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Showing {sortedProducts.length} of {products.length} products
                </p>
                <Badge variant="outline" className="gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  {totalItemsInCart} items in cart
                </Badge>
              </div>
            </div>

            {/* Products Grid */}
            {sortedProducts.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                  No products found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedProducts.map((product) => {
                  const quantity = getProductQuantity(product.id)
                  
                  return (
                    <Card 
                      key={product.id} 
                      className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-primary/10"
                    >
                      {/* Product Image */}
                      <div className="aspect-square relative bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                        {/* Category Badge */}
                        {product.category && (
                          <Badge className="absolute top-3 left-3 bg-primary/90 hover:bg-primary">
                            {product.category}
                          </Badge>
                        )}
                        {/* Rating Badge */}
                        <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                          <Star className="w-3 h-3 fill-primary text-primary" />
                          <span className="text-xs font-bold">{product.rating}</span>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-4 space-y-3">
                        <h3 className="font-bold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {product.description}
                        </p>
                        
                        <div className="flex items-center justify-between pt-2 border-t">
                          <div>
                            <p className="text-xs font-medium text-primary">{product.weight}</p>
                            <p className="text-lg font-bold text-primary">₹{product.price}</p>
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-muted-foreground">
                                ({product.reviews} reviews)
                              </span>
                            </div>
                          </div>

                          {/* Cart Controls */}
                          {quantity > 0 ? (
                            <div className="flex items-center gap-2">
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8"
                                onClick={() => removeFromCart(product.id)}
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="font-bold text-lg min-w-8 text-center">{quantity}</span>
                              <Button
                                size="icon"
                                variant="default"
                                className="h-8 w-8 bg-primary hover:bg-primary/90"
                                onClick={() => addToCart(product)}
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              className="bg-primary hover:bg-primary/90 gap-2"
                              onClick={() => addToCart(product)}
                            >
                              <ShoppingCart className="w-4 h-4" />
                              Add to Cart
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        {/* Featured Banner */}
        <section className="py-12 px-4 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="max-w-7xl mx-auto text-center space-y-4">
            <h2 className="text-2xl font-bold font-serif text-primary">
              🎁 Free Delivery on Orders Above ₹499
            </h2>
            <p className="text-muted-foreground">
              Experience the authentic taste of tradition with every bite
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}