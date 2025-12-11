"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Trash2, ShoppingBag, ArrowRight, Loader2 } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface CartItem {
  _id: string
  name: string
  price: number
  weight: string
  image: string
  quantity: number
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuthAndFetchCart = async () => {
      try {
        setLoading(true)
        
        // Fetch user info first to check auth
        const userResponse = await fetch('/api/users/me', {
          credentials: 'include'
        })
        
        const userData = await userResponse.json()
        
        if (!userData.success) {
          // Not authenticated, redirect to login
          router.push("/auth/login?redirect=/cart")
          return
        }

        // If authenticated, fetch cart
        await fetchCart()
      } catch (error) {
        console.error('Auth check error:', error)
        router.push("/auth/login?redirect=/cart")
      } finally {
        setLoading(false)
      }
    }

    checkAuthAndFetchCart()
  }, [router])

  const fetchCart = async () => {
    try {
      setLoading(true)
      
      const response = await fetch('/api/cart', {
        credentials: 'include'
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Transform cart items
        const cartItems = data.data?.items?.map((item: any) => ({
          _id: item.product._id,
          name: item.product.name,
          price: item.product.price,
          weight: item.product.weight,
          image: item.product.image,
          quantity: item.quantity
        })) || []
        setCart(cartItems)
      } else {
        if (data.error === 'Unauthorized') {
          router.push("/auth/login?redirect=/cart")
        } else {
          toast.error('Failed to load cart')
        }
      }
    } catch (error) {
      console.error('Error fetching cart:', error)
      toast.error('Failed to load cart')
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 0) return
    
    try {
      setUpdating(id)
      
      if (quantity === 0) {
        await removeFromCart(id)
        return
      }

      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ productId: id, quantity }),
      })

      const data = await response.json()
      
      if (data.success) {
        setCart(prevCart => 
          prevCart.map(item => 
            item._id === id ? { ...item, quantity } : item
          )
        )
        toast.success('Cart updated')
      } else {
        if (data.error === 'Unauthorized') {
          router.push("/auth/login?redirect=/cart")
        } else {
          toast.error(data.error || 'Failed to update cart')
          fetchCart()
        }
      }
    } catch (error) {
      console.error('Error updating cart:', error)
      toast.error('Failed to update cart')
      fetchCart()
    } finally {
      setUpdating(null)
    }
  }

  const removeFromCart = async (id: string) => {
    try {
      setUpdating(id)
      
      const response = await fetch(`/api/cart?productId=${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      const data = await response.json()
      
      if (data.success) {
        setCart(prevCart => prevCart.filter(item => item._id !== id))
        toast.success('Item removed from cart')
      } else {
        if (data.error === 'Unauthorized') {
          router.push("/auth/login?redirect=/cart")
        } else {
          toast.error(data.error || 'Failed to remove item')
          fetchCart()
        }
      }
    } catch (error) {
      console.error('Error removing from cart:', error)
      toast.error('Failed to remove item')
      fetchCart()
    } finally {
      setUpdating(null)
    }
  }

  const clearCart = async () => {
    try {
      setUpdating('clear')
      
      const response = await fetch('/api/cart', {
        method: 'DELETE',
        credentials: 'include'
      })

      const data = await response.json()
      
      if (data.success) {
        setCart([])
        toast.success('Cart cleared')
      } else {
        if (data.error === 'Unauthorized') {
          router.push("/auth/login?redirect=/cart")
        } else {
          toast.error(data.error || 'Failed to clear cart')
          fetchCart()
        }
      }
    } catch (error) {
      console.error('Error clearing cart:', error)
      toast.error('Failed to clear cart')
      fetchCart()
    } finally {
      setUpdating(null)
    }
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.05
  const shipping = subtotal > 500 ? 0 : 40
  const total = subtotal + tax + shipping

  const handleCheckout = () => {
    router.push("/checkout")
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background py-12 px-4">
          <div className="max-w-7xl mx-auto text-center py-16">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground mt-4">Loading your cart...</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold font-serif text-primary">Shopping Cart</h1>
            {cart.length > 0 && (
              <Button
                variant="outline"
                onClick={clearCart}
                disabled={updating === 'clear'}
                className="text-red-600 hover:bg-red-50 border-red-200"
              >
                {updating === 'clear' ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4 mr-2" />
                )}
                Clear Cart
              </Button>
            )}
          </div>

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
                  <Card key={item._id} className="p-4 flex gap-4 items-center">
                    <div className="w-24 h-24 relative rounded overflow-hidden flex-shrink-0">
                      <Image 
                        src={item.image || "/laddoo.jpg"} 
                        alt={item.name} 
                        fill 
                        className="object-cover" 
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.weight}</p>
                      <p className="font-bold text-primary">₹{item.price}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 bg-muted rounded">
                        <button 
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          disabled={updating === item._id}
                          className="px-3 py-1 hover:bg-muted-foreground/10 disabled:opacity-50"
                        >
                          {updating === item._id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            "-"
                          )}
                        </button>
                        <span className="px-3 py-1 border-l border-r min-w-8 text-center">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          disabled={updating === item._id}
                          className="px-3 py-1 hover:bg-muted-foreground/10 disabled:opacity-50"
                        >
                          {updating === item._id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            "+"
                          )}
                        </button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item._id)}
                        disabled={updating === item._id}
                        className="text-red-600 hover:bg-red-50"
                      >
                        {updating === item._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
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
                  size="lg"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Link href="/shop">
                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </Card>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}