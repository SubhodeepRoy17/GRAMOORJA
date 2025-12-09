"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ShoppingCart, Star } from "lucide-react"
import Image from "next/image"

const products = [
  {
    id: 1,
    name: "Premium Kanakchur Muri Ladoo",
    price: 299,
    weight: "500g",
    rating: 4.8,
    reviews: 156,
    description: "Traditional handcrafted sweets",
    image: "/laddoo.jpg",
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
  },
]

export default function ShopPage() {
  const [cart, setCart] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProducts = products.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const addToCart = (product: any) => {
    const existingItem = cart.find((item) => item.id === product.id)
    if (existingItem) {
      setCart(cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
    localStorage.setItem("cart", JSON.stringify([...cart, { ...product, quantity: 1 }]))
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-16 px-4 bg-gradient-to-b from-secondary/10 to-transparent">
          <div className="max-w-7xl mx-auto text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold font-serif text-primary">Our Collection</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Handcrafted traditional sweets made with premium ingredients
            </p>
          </div>
        </section>

        {/* Shop Section */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Search */}
            <div className="mb-8">
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square relative bg-muted overflow-hidden">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-4 space-y-3">
                    <h3 className="font-semibold text-foreground line-clamp-2">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.description}</p>
                    <p className="text-sm font-medium text-primary">{product.weight}</p>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-primary text-primary" />
                        <span className="text-sm font-medium">{product.rating}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">({product.reviews})</span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-lg font-bold text-primary">₹{product.price}</span>
                      <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={() => addToCart(product)}>
                        <ShoppingCart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
