"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart)
      const grouped = parsedCart.reduce((acc: any, item: any) => {
        const existing = acc.find((i: any) => i.id === item.id)
        if (existing) {
          existing.quantity += item.quantity
        } else {
          acc.push(item)
        }
        return acc
      }, [])
      setCart(grouped)
    }
  }, [])

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
    } else {
      const updated = cart.map((item) => (item.id === id ? { ...item, quantity } : item))
      setCart(updated)
      localStorage.setItem("cart", JSON.stringify(updated))
    }
  }

  const removeFromCart = (id: number) => {
    const updated = cart.filter((item) => item.id !== id)
    setCart(updated)
    localStorage.setItem("cart", JSON.stringify(updated))
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.05
  const shipping = subtotal > 500 ? 0 : 40
  const total = subtotal + tax + shipping

  const handleCheckout = () => {
    const user = localStorage.getItem("user")
    if (!user) {
      router.push("/auth/login")
      return
    }
    router.push("/checkout")
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold font-serif text-primary mb-8">Shopping Cart</h1>

          {cart.length === 0 ? (
            <Card className="p-12 text-center space-y-4">
              <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground opacity-50" />
              <h2 className="text-2xl font-semibold">Your cart is empty</h2>
              <p className="text-muted-foreground">Start adding some delicious sweets!</p>
              <Link href="/shop">
                <Button className="bg-primary hover:bg-primary/90">
                  Continue Shopping
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cart.map((item) => (
                  <Card key={item.id} className="p-4 flex gap-4">
                    <div className="w-24 h-24 relative rounded overflow-hidden">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.weight}</p>
                      <p className="font-bold text-primary">₹{item.price}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 bg-muted rounded">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1">
                          -
                        </button>
                        <span className="px-3 py-1 border-l border-r">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1">
                          +
                        </button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <Card className="p-6 h-fit sticky top-20 space-y-4">
                <h2 className="text-xl font-bold">Order Summary</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (5%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
                      {shipping === 0 ? "Free" : `₹${shipping}`}
                    </span>
                  </div>
                </div>
                <div className="border-t pt-4 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">₹{total.toFixed(2)}</span>
                </div>
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Card>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
