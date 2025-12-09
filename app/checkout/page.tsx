"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CheckCircle2, ArrowRight } from "lucide-react"

export default function CheckoutPage() {
  const [cart, setCart] = useState<any[]>([])
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [loading, setLoading] = useState(false)
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

    const userData = JSON.parse(user)
    setFormData((prev) => ({
      ...prev,
      fullName: userData.name,
      email: userData.email,
    }))
  }, [router])

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.05
  const shipping = subtotal > 500 ? 0 : 40
  const total = subtotal + tax + shipping

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const order = {
        id: "ORD-" + Date.now(),
        items: cart,
        total,
        status: "pending",
        createdAt: new Date().toISOString(),
        ...formData,
      }

      const orders = JSON.parse(localStorage.getItem("orders") || "[]")
      orders.push(order)
      localStorage.setItem("orders", JSON.stringify(orders))
      localStorage.removeItem("cart")

      setOrderPlaced(true)
    } catch (err) {
      console.error("Order failed:", err)
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
              <Link href="/account">
                <Button className="w-full bg-primary hover:bg-primary/90">
                  View Order
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </Card>
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
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="col-span-2 px-4 py-2 border border-border rounded"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="col-span-2 px-4 py-2 border border-border rounded"
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="col-span-2 px-4 py-2 border border-border rounded"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Street Address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="col-span-2 px-4 py-2 border border-border rounded"
                      required
                    />
                    <input
                      type="text"
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="px-4 py-2 border border-border rounded"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Pincode"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      className="px-4 py-2 border border-border rounded"
                      required
                    />
                  </div>
                </div>

                {/* Payment Method */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Payment Method</h2>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 border border-primary rounded cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={formData.paymentMethod === "cod"}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      />
                      <span>Cash on Delivery (COD)</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 border border-muted rounded cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      />
                      <span>Credit/Debit Card</span>
                    </label>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Place Order"}
                  {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>
              </form>
            </Card>
          </div>

          {/* Order Summary */}
          <Card className="p-6 h-fit sticky top-20 space-y-4">
            <h2 className="text-xl font-bold">Order Summary</h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.name} x{item.quantity}
                  </span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
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
                <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
              </div>
            </div>
            <div className="border-t pt-4 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">₹{total.toFixed(2)}</span>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  )
}
