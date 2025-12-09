"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { LogOut, Package, UserIcon } from "lucide-react"

export default function AccountPage() {
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("orders")
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/auth/login")
      return
    }

    setUser(JSON.parse(userData))

    const savedOrders = localStorage.getItem("orders")
    if (savedOrders) {
      const allOrders = JSON.parse(savedOrders)
      const userOrders = allOrders.filter((o: any) => o.email === JSON.parse(userData).email)
      setOrders(userOrders)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    router.push("/")
  }

  if (!user) return null

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Profile Card */}
            <Card className="md:col-span-1 p-6 space-y-4">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <UserIcon className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center">
                <h2 className="font-bold text-lg">{user.name}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <Button
                variant="outline"
                className="w-full border-red-600 text-red-600 hover:bg-red-50 bg-transparent"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </Card>

            {/* Content */}
            <div className="md:col-span-3 space-y-6">
              {/* Tabs */}
              <div className="flex gap-4 border-b">
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`pb-2 px-4 font-medium border-b-2 transition-colors ${
                    activeTab === "orders"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Package className="w-4 h-4 mr-2 inline" />
                  Orders
                </button>
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`pb-2 px-4 font-medium border-b-2 transition-colors ${
                    activeTab === "profile"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <UserIcon className="w-4 h-4 mr-2 inline" />
                  Profile
                </button>
              </div>

              {/* Orders Tab */}
              {activeTab === "orders" && (
                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <Card className="p-12 text-center text-muted-foreground">
                      <Package className="w-12 h-12 mx-auto opacity-50 mb-4" />
                      <p>No orders yet. Start shopping!</p>
                    </Card>
                  ) : (
                    orders.map((order) => (
                      <Card key={order.id} className="p-6 space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold">{order.id}</h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded text-sm font-medium ${
                              order.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : order.status === "shipped"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                            }`}
                          >
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                        <div className="border-t pt-4">
                          {order.items.map((item: any) => (
                            <div key={item.id} className="flex justify-between text-sm py-1">
                              <span>
                                {item.name} x{item.quantity}
                              </span>
                              <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                        <div className="border-t pt-4 flex justify-between font-bold">
                          <span>Total</span>
                          <span className="text-primary">₹{order.total.toFixed(2)}</span>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              )}

              {/* Profile Tab */}
              {activeTab === "profile" && (
                <Card className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <p className="px-4 py-2 bg-muted rounded">{user.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <p className="px-4 py-2 bg-muted rounded">{user.email}</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
