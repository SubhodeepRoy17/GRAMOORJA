"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface CartItem {
  _id: string
  name: string
  price: number
  weight: string
  quantity: number
}

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [loading, setLoading] = useState(false)
  const [cartLoading, setCartLoading] = useState(true)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    paymentMethod: "cod",
  })
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (!user) {
      router.push("/auth/login")
      return
    }

    // Load user data
    const userData = JSON.parse(user)
    setFormData((prev) => ({
      ...prev,
      fullName: userData.name,
      email: userData.email,
      phone: userData.phone || "",
      address: userData.address || "",
    }))

    // Load cart
    fetchCart()
  }, [router])

  const fetchCart = async () => {
    try {
      setCartLoading(true)
      const response = await fetch('/api/cart')
      const data = await response.json()
      
      if (data.success) {
        const cartItems = data.data?.items?.map((item: any) => ({
          _id: item.product._id,
          name: item.product.name,
          price: item.product.price,
          weight: item.product.weight,
          quantity: item.quantity
        })) || []
        setCart(cartItems)
      } else {
        toast.error('Failed to load cart')
      }
    } catch (error) {
      console.error('Error fetching cart:', error)
      toast.error('Failed to load cart')
    } finally {
      setCartLoading(false)
    }
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.05
  const shipping = subtotal > 500 ? 0 : 40
  const total = subtotal + tax + shipping

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const orderData = {
        shippingAddress: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          pincode: formData.pincode,
        },
        paymentMethod: formData.paymentMethod,
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      })

      const data = await response.json()

      if (!data.success) {
        toast.error(data.error || 'Failed to place order')
        setLoading(false)
        return
      }

      toast.success('Order placed successfully!')
      setOrderPlaced(true)
    } catch (err) {
      console.error('Order failed:', err)
      toast.error('Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (orderPlaced) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background py-12 px-4">
          <div className="max-w-md mx-auto text-center space-y-6">
            <Card className="p-12 space-y-6">
              <CheckCircle2 className="w-16 h-16 mx-auto text-green-600" />
              <div>
                <h1 className="text-3xl font-bold font-serif text-primary mb-2">Order Confirmed!</h1>
                <p className="text-muted-foreground">Thank you for your order. Track it in your account.</p>
              </div>
              <div className="space-y-3">
                <Link href="/account">
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    View Orders
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/shop">
                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (cartLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background py-12 px-4">
          <div className="max-w-7xl mx-auto text-center py-16">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground mt-4">Loading checkout...</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (cart.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background py-12 px-4">
          <div className="max-w-7xl mx-auto text-center py-16">
            <h1 className="text-3xl font-bold font-serif text-primary mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">Add some sweets to your cart before checking out</p>
            <Link href="/shop">
              <Button className="bg-primary hover:bg-primary/90">
                Continue Shopping
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
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
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Card className="p-8 space-y-8">
              <h1 className="text-3xl font-bold font-serif text-primary">Checkout</h1>

              <form onSubmit={handlePlaceOrder} className="space-y-6">
                {/* Delivery Address */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Delivery Address</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Full Name</label>
                      <Input
                        type="text"
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <Input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Phone Number</label>
                      <Input
                        type="tel"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Street Address</label>
                      <Input
                        type="text"
                        placeholder="Street Address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        required
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">City</label>
                      <Input
                        type="text"
                        placeholder="City"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        required
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Pincode</label>
                      <Input
                        type="text"
                        placeholder="Pincode"
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Payment Method</h2>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-secondary/10 transition-colors">
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={formData.paymentMethod === "cod"}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                        className="w-4 h-4 text-primary"
                        disabled={loading}
                      />
                      <div className="flex-1">
                        <span className="font-medium">Cash on Delivery (COD)</span>
                        <p className="text-sm text-muted-foreground">Pay when you receive your order</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-secondary/10 transition-colors">
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={formData.paymentMethod === "card"}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                        className="w-4 h-4 text-primary"
                        disabled={loading}
                      />
                      <div className="flex-1">
                        <span className="font-medium">Credit/Debit Card</span>
                        <p className="text-sm text-muted-foreground">Pay securely with your card</p>
                      </div>
                    </label>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Place Order
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>

          {/* Order Summary */}
          <Card className="p-6 h-fit sticky top-20 space-y-4">
            <h2 className="text-xl font-bold">Order Summary</h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {cart.map((item) => (
                <div key={item._id} className="flex justify-between items-center text-sm">
                  <div className="flex-1">
                    <span className="font-medium">{item.name}</span>
                    <p className="text-muted-foreground text-xs">{item.weight} × {item.quantity}</p>
                  </div>
                  <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 space-y-2 text-sm">
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
            <div className="text-xs text-muted-foreground">
              By placing your order, you agree to our Terms & Conditions
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  )
}