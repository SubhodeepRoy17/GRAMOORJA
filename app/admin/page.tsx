"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Package, ShoppingCart, Users, TrendingUp } from "lucide-react"

export default function AdminPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, totalUsers: 0 })
  const router = useRouter()

  useEffect(() => {
    const adminPass = localStorage.getItem("adminPass")
    if (!adminPass) {
      const pass = prompt("Enter admin password:")
      if (pass === "admin123") {
        localStorage.setItem("adminPass", "true")
      } else {
        router.push("/")
      }
    }

    const savedOrders = localStorage.getItem("orders")
    if (savedOrders) {
      const allOrders = JSON.parse(savedOrders)
      setOrders(allOrders)
      setStats((prev) => ({
        ...prev,
        totalOrders: allOrders.length,
        totalRevenue: allOrders.reduce((sum: number, o: any) => sum + o.total, 0),
      }))
    }

    const savedUsers = localStorage.getItem("users")
    if (savedUsers) {
      const allUsers = JSON.parse(savedUsers)
      setUsers(allUsers)
      setStats((prev) => ({ ...prev, totalUsers: allUsers.length }))
    }
  }, [router])

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    const updated = orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
    setOrders(updated)
    localStorage.setItem("orders", JSON.stringify(updated))
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold font-serif text-primary mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage orders, users, and inventory</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-muted-foreground">Total Orders</h3>
                <ShoppingCart className="w-5 h-5 text-primary" />
              </div>
              <p className="text-3xl font-bold">{stats.totalOrders}</p>
            </Card>
            <Card className="p-6 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-muted-foreground">Revenue</h3>
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <p className="text-3xl font-bold">₹{stats.totalRevenue.toFixed(0)}</p>
            </Card>
            <Card className="p-6 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-muted-foreground">Users</h3>
                <Users className="w-5 h-5 text-primary" />
              </div>
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
            </Card>
            <Card className="p-6 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-muted-foreground">Products</h3>
                <Package className="w-5 h-5 text-primary" />
              </div>
              <p className="text-3xl font-bold">4</p>
            </Card>
          </div>

          {/* Orders Management */}
          <div>
            <h2 className="text-2xl font-bold font-serif text-primary mb-4">Recent Orders</h2>
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Order ID</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Customer</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Amount</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-t">
                        <td className="px-6 py-4 text-sm font-mono">{order.id}</td>
                        <td className="px-6 py-4 text-sm">{order.fullName}</td>
                        <td className="px-6 py-4 text-sm font-bold">₹{order.total.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className={`px-3 py-1 rounded text-sm font-medium border-0 ${
                              order.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : order.status === "shipped"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <Button size="sm" variant="outline">
                            Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
