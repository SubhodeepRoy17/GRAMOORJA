"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Star, Search, Filter, Plus, Minus, Loader2 } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

interface Product {
  _id: string
  name: string
  price: number
  weight: string
  rating: number
  reviews: number
  description: string
  image: string
  category?: string
  stock: number
}

interface CartItem {
  _id: string
  name: string
  price: number
  weight: string
  rating: number
  reviews: number
  description: string
  image: string
  category?: string
  quantity: number
}

const categories = ["All", "ladoo", "gift", "pack", "assorted", "premium", "sugarfree"]

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("default")
  const [loading, setLoading] = useState(true)
  const [cartLoading, setCartLoading] = useState(false)

  // Fetch products from API
  useEffect(() => {
    fetchProducts()
    fetchCart()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/products')
      const data = await response.json()
      
      if (data.success) {
        setProducts(data.data)
      } else {
        toast.error('Failed to load products')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart')
      const data = await response.json()
      
      if (data.success) {
        // Transform cart items to match our interface
        const cartItems = data.data?.items?.map((item: any) => ({
          ...item.product,
          quantity: item.quantity
        })) || []
        setCart(cartItems)
      }
    } catch (error) {
      console.error('Error fetching cart:', error)
    }
  }

  const getProductQuantity = (productId: string) => {
    const cartItem = cart.find(item => item._id === productId)
    return cartItem ? cartItem.quantity : 0
  }

  const addToCart = async (product: Product) => {
    try {
      setCartLoading(true)
      
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product._id,
          quantity: 1
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        // Update local cart state
        const existingItem = cart.find(item => item._id === product._id)
        let newCart
        
        if (existingItem) {
          newCart = cart.map(item => 
            item._id === product._id 
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        } else {
          newCart = [...cart, { ...product, quantity: 1 }]
        }
        
        setCart(newCart)
        toast.success(`${product.name} added to cart`)
      } else {
        toast.error(data.error || 'Failed to add to cart')
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Failed to add to cart')
    } finally {
      setCartLoading(false)
    }
  }

  const removeFromCart = async (productId: string) => {
    try {
      setCartLoading(true)
      
      const currentQuantity = getProductQuantity(productId)
      
      if (currentQuantity <= 1) {
        // Remove item completely
        const response = await fetch(`/api/cart?productId=${productId}`, {
          method: 'DELETE',
        })

        const data = await response.json()
        
        if (data.success) {
          const newCart = cart.filter(item => item._id !== productId)
          setCart(newCart)
          const product = products.find(p => p._id === productId)
          if (product) {
            toast.info(`${product.name} removed from cart`)
          }
        }
      } else {
        // Decrease quantity
        const response = await fetch('/api/cart', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: productId,
            quantity: currentQuantity - 1
          }),
        })

        const data = await response.json()
        
        if (data.success) {
          const newCart = cart.map(item => 
            item._id === productId 
              ? { ...item, quantity: item.quantity - 1 }
              : item
          ).filter(item => item.quantity > 0)
          
          setCart(newCart)
          const product = products.find(p => p._id === productId)
          if (product) {
            toast.info(`Reduced ${product.name} quantity`)
          }
        }
      }
    } catch (error) {
      console.error('Error removing from cart:', error)
      toast.error('Failed to update cart')
    } finally {
      setCartLoading(false)
    }
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
            {loading ? (
              <div className="text-center py-16">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                <p className="text-muted-foreground mt-4">Loading products...</p>
              </div>
            ) : sortedProducts.length === 0 ? (
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
                  const quantity = getProductQuantity(product._id)
                  const outOfStock = product.stock <= 0
                  
                  return (
                    <Card 
                      key={product._id} 
                      className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-primary/10"
                    >
                      {/* Product Image */}
                      <div className="aspect-square relative bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden">
                        <Image
                          src={product.image || "/laddoo.jpg"}
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
                        {/* Out of Stock Overlay */}
                        {outOfStock && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="bg-red-600 text-white px-3 py-1 rounded-full font-bold">
                              Out of Stock
                            </span>
                          </div>
                        )}
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
                                ({product.reviews} reviews) • {product.stock} in stock
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
                                onClick={() => removeFromCart(product._id)}
                                disabled={cartLoading || outOfStock}
                              >
                                {cartLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Minus className="w-4 h-4" />}
                              </Button>
                              <span className="font-bold text-lg min-w-8 text-center">{quantity}</span>
                              <Button
                                size="icon"
                                variant="default"
                                className="h-8 w-8 bg-primary hover:bg-primary/90"
                                onClick={() => addToCart(product)}
                                disabled={cartLoading || outOfStock}
                              >
                                {cartLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-4 h-4" />}
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              className="bg-primary hover:bg-primary/90 gap-2"
                              onClick={() => addToCart(product)}
                              disabled={cartLoading || outOfStock}
                            >
                              {cartLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingCart className="w-4 h-4" />}
                              {outOfStock ? "Out of Stock" : "Add to Cart"}
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