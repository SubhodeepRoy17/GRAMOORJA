"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Package, ShoppingCart, Users, TrendingUp } from "lucide-react"
import { toast } from "sonner"

export default function AdminPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, totalUsers: 0 })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        setLoading(true)
        
        // First check if user is authenticated
        const userResponse = await fetch('/api/users/me', {
          credentials: 'include'
        })
        
        const userData = await userResponse.json()
        
        if (!userData.success) {
          // Not authenticated
          router.push("/auth/login?redirect=/admin")
          return
        }

        // Check if user is admin
        if (userData.data.role !== 'admin') {
          toast.error('Admin access required')
          router.push("/")
          return
        }

        // User is admin, fetch admin data
        await fetchAdminData()
      } catch (error) {
        console.error('Admin access check error:', error)
        router.push("/auth/login?redirect=/admin")
      } finally {
        setLoading(false)
      }
    }

    checkAdminAccess()
  }, [router])

  const fetchAdminData = async () => {
    try {
      const response = await fetch('/api/admin', {
        credentials: 'include'
      })
      
      const data = await response.json()
      
      if (data.success) {
        setOrders(data.data.orders || [])
        setUsers(data.data.users || [])
        setStats({
          totalOrders: data.data.stats?.totalOrders || 0,
          totalRevenue: data.data.stats?.totalRevenue || 0,
          totalUsers: data.data.stats?.totalUsers || 0,
        })
      } else {
        toast.error(data.error || 'Failed to load admin data')
      }
    } catch (error) {
      console.error('Error fetching admin data:', error)
      toast.error('Failed to load admin data')
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      })

      const data = await response.json()
      
      if (data.success) {
        setOrders(prev => 
          prev.map(order => 
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        )
        toast.success('Order status updated')
      } else {
        toast.error(data.error || 'Failed to update order status')
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      toast.error('Failed to update order status')
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background py-12 px-4">
          <div className="max-w-7xl mx-auto text-center py-16">
            <div className="w-8 h-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
            <p className="text-muted-foreground mt-4">Loading admin dashboard...</p>
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
                      <tr key={order._id} className="border-t">
                        <td className="px-6 py-4 text-sm font-mono">{order.orderId}</td>
                        <td className="px-6 py-4 text-sm">{order.customerName || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm font-bold">₹{order.total?.toFixed(2) || '0.00'}</td>
                        <td className="px-6 py-4">
                          <select
                            value={order.status || 'pending'}
                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                            className={`px-3 py-1 rounded text-sm font-medium border-0 ${
                              order.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : order.status === "shipped"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => router.push(`/admin/orders/${order._id}`)}
                          >
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