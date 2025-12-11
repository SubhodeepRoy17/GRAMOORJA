"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  LogOut, 
  Package, 
  UserIcon, 
  Settings, 
  ShoppingBag, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  Key, 
  Loader2,
  Edit,
  Check,
  X,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface Order {
  _id: string
  orderId: string
  total: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
  paymentMethod: string
  paymentStatus: string
  items: Array<{
    name: string
    quantity: number
    price: number
    weight: string
  }>
  shippingAddress?: {
    fullName: string
    address: string
    city: string
    pincode: string
    phone: string
  }
  estimatedDelivery?: string
  trackingNumber?: string
}

interface UserData {
  _id: string
  name: string
  email: string
  phone: string
  address: string
  role: string
  createdAt?: string
}

export default function AccountPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [activeTab, setActiveTab] = useState("orders")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [passwordError, setPasswordError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/users/me', {
          credentials: 'include'
        })
        
        const data = await response.json()
        
        if (!data.success) {
          // Token is invalid, redirect to login
          localStorage.removeItem("user")
          router.push("/auth/login?redirect=/account")
          return
        }

        // Set user data
        setUser(data.data)
        localStorage.setItem('user', JSON.stringify(data.data))
        
        // Update form data
        setFormData({
          name: data.data.name,
          email: data.data.email,
          phone: data.data.phone || "",
          address: data.data.address || "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        })
        
        // Fetch orders
        fetchOrders()
      } catch (error) {
        console.error('Auth check error:', error)
        localStorage.removeItem("user")
        router.push("/auth/login?redirect=/account")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true)
      const response = await fetch('/api/orders', {
        credentials: 'include'
      })
      
      const data = await response.json()
      
      if (data.success) {
        setOrders(data.data)
      } else {
        if (data.error === 'Unauthorized') {
          localStorage.removeItem("user")
          router.push('/auth/login')
        }
        toast.error(data.error || 'Failed to load orders')
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Failed to load orders')
    } finally {
      setOrdersLoading(false)
    }
  }

  const validatePasswords = () => {
    setPasswordError("")
    
    if (formData.newPassword && formData.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters")
      return false
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      setPasswordError("Passwords don't match")
      return false
    }
    
    if (formData.newPassword && !formData.currentPassword) {
      setPasswordError("Current password is required to set a new password")
      return false
    }
    
    return true
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validatePasswords()) {
      return
    }
    
    setUpdating(true)
    setPasswordError("")

    try {
      const updateData: any = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address
      }

      // Only include password fields if new password is provided
      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword
        updateData.newPassword = formData.newPassword
      }

      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updateData),
      })

      const data = await response.json()

      if (!data.success) {
        toast.error(data.error || 'Failed to update profile')
        if (data.error?.toLowerCase().includes('password')) {
          setPasswordError(data.error)
        }
        return
      }

      setUser(data.data)
      localStorage.setItem('user', JSON.stringify(data.data))
      setEditMode(false)
      toast.success('Profile updated successfully!')
      
      // Reset password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }))
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setUpdating(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include'
      })
      localStorage.removeItem('user')
      localStorage.removeItem('adminPass')
      toast.success('Logged out successfully')
      window.location.href = '/'
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Failed to logout')
    }
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-800',
          icon: Clock,
          label: 'Pending',
          description: 'Order received, waiting for confirmation'
        }
      case 'confirmed':
        return {
          color: 'bg-blue-100 text-blue-800',
          icon: CheckCircle,
          label: 'Confirmed',
          description: 'Order confirmed, preparing for shipment'
        }
      case 'processing':
        return {
          color: 'bg-purple-100 text-purple-800',
          icon: Settings,
          label: 'Processing',
          description: 'Order being processed'
        }
      case 'shipped':
        return {
          color: 'bg-indigo-100 text-indigo-800',
          icon: Truck,
          label: 'Shipped',
          description: 'Order has been shipped'
        }
      case 'delivered':
        return {
          color: 'bg-green-100 text-green-800',
          icon: CheckCircle,
          label: 'Delivered',
          description: 'Order has been delivered'
        }
      case 'cancelled':
        return {
          color: 'bg-red-100 text-red-800',
          icon: AlertCircle,
          label: 'Cancelled',
          description: 'Order has been cancelled'
        }
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: Clock,
          label: status,
          description: 'Order status unknown'
        }
    }
  }

  const getPaymentStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-800',
          label: 'Pending'
        }
      case 'paid':
        return {
          color: 'bg-green-100 text-green-800',
          label: 'Paid'
        }
      case 'failed':
        return {
          color: 'bg-red-100 text-red-800',
          label: 'Failed'
        }
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          label: status
        }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTotalOrders = () => orders.length
  const getTotalSpent = () => orders.reduce((sum, order) => sum + order.total, 0)
  const getPendingOrders = () => orders.filter(order => 
    ['pending', 'confirmed', 'processing'].includes(order.status)
  ).length

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background py-12 px-4">
          <div className="max-w-7xl mx-auto text-center py-16">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground mt-4">Loading account...</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (!user) {
    return null
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold font-serif text-primary">My Account</h1>
            <p className="text-muted-foreground">Welcome back, {user.name}! 👋</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="p-6 space-y-6">
                {/* Profile Info */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4">
                    <div className="w-20 h-20 rounded-full bg-background flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">
                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-bold text-lg">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                      {user.role === 'admin' ? 'Admin' : 'Member'}
                    </span>
                    {user.createdAt && (
                      <span className="text-xs text-muted-foreground">
                        Since {new Date(user.createdAt).getFullYear()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Orders</span>
                    <span className="font-bold">{getTotalOrders()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Spent</span>
                    <span className="font-bold text-primary">₹{getTotalSpent().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Pending Orders</span>
                    <span className="font-bold">{getPendingOrders()}</span>
                  </div>
                </div>

                {/* Navigation */}
                <div className="space-y-2">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => setActiveTab("orders")}
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    My Orders
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => setActiveTab("profile")}
                  >
                    <UserIcon className="w-4 h-4 mr-2" />
                    Profile Details
                  </Button>
                  {user.role === 'admin' && (
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start"
                      onClick={() => router.push('/admin')}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Admin Dashboard
                    </Button>
                  )}
                </div>

                <Button 
                  variant="outline" 
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </Card>

              {/* Support Card */}
              <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
                <div className="space-y-3">
                  <h3 className="font-bold">Need Help?</h3>
                  <p className="text-sm text-muted-foreground">
                    Contact our support team for any questions about your orders or account.
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full border-primary text-primary hover:bg-primary/5"
                    onClick={() => router.push('/contact')}
                  >
                    Contact Support
                  </Button>
                </div>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="orders" className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    My Orders
                  </TabsTrigger>
                  <TabsTrigger value="profile" className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4" />
                    Profile Details
                  </TabsTrigger>
                </TabsList>

                {/* Orders Tab */}
                <TabsContent value="orders" className="space-y-6">
                  {ordersLoading ? (
                    <div className="text-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                      <p className="text-muted-foreground mt-4">Loading your orders...</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <Card className="p-12 text-center">
                      <Package className="w-16 h-16 mx-auto text-muted-foreground opacity-50 mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                      <p className="text-muted-foreground mb-6">Start shopping to see your orders here</p>
                      <Button onClick={() => router.push('/shop')} className="bg-primary hover:bg-primary/90">
                        Start Shopping
                      </Button>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => {
                        const statusConfig = getStatusConfig(order.status)
                        const paymentConfig = getPaymentStatusConfig(order.paymentStatus)
                        const StatusIcon = statusConfig.icon
                        
                        return (
                          <Card key={order._id} className="p-6 hover:shadow-lg transition-shadow">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                              <div className="space-y-1">
                                <h3 className="font-bold text-lg">Order #{order.orderId}</h3>
                                <p className="text-sm text-muted-foreground flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  Placed on {formatDate(order.createdAt)}
                                </p>
                                {order.estimatedDelivery && (
                                  <p className="text-sm text-muted-foreground">
                                    Estimated delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                                  <StatusIcon className="w-3 h-3 inline mr-1" />
                                  {statusConfig.label}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${paymentConfig.color}`}>
                                  {paymentConfig.label}
                                </span>
                              </div>
                            </div>
                            
                            {/* Order Items */}
                            <div className="border-t pt-4 mb-4">
                              <h4 className="font-medium mb-3">Items ({order.items.length})</h4>
                              <div className="space-y-3">
                                {order.items.map((item, index) => (
                                  <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                                        <Package className="w-5 h-5 text-primary" />
                                      </div>
                                      <div>
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                          {item.weight} • Quantity: {item.quantity}
                                        </p>
                                      </div>
                                    </div>
                                    <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Shipping Info */}
                            {order.shippingAddress && (
                              <div className="border-t pt-4 mb-4">
                                <h4 className="font-medium mb-2 flex items-center gap-2">
                                  <MapPin className="w-4 h-4" />
                                  Shipping Address
                                </h4>
                                <div className="text-sm text-muted-foreground">
                                  <p>{order.shippingAddress.fullName}</p>
                                  <p>{order.shippingAddress.address}</p>
                                  <p>{order.shippingAddress.city} - {order.shippingAddress.pincode}</p>
                                  <p>{order.shippingAddress.phone}</p>
                                </div>
                              </div>
                            )}

                            {/* Order Summary */}
                            <div className="border-t pt-4">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="text-sm text-muted-foreground">Payment Method</p>
                                  <p className="font-medium">
                                    {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 
                                     order.paymentMethod === 'card' ? 'Credit/Debit Card' : 
                                     order.paymentMethod.toUpperCase()}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm text-muted-foreground">Total Amount</p>
                                  <p className="text-2xl font-bold text-primary">₹{order.total.toFixed(2)}</p>
                                </div>
                              </div>
                            </div>

                            {/* Tracking Info */}
                            {order.trackingNumber && (
                              <div className="mt-4 p-3 bg-secondary/20 rounded-lg">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Truck className="w-4 h-4 text-primary" />
                                    <span className="text-sm font-medium">Tracking Number:</span>
                                    <code className="text-sm bg-background px-2 py-1 rounded">
                                      {order.trackingNumber}
                                    </code>
                                  </div>
                                  <Button variant="outline" size="sm">
                                    Track Order
                                  </Button>
                                </div>
                              </div>
                            )}
                          </Card>
                        )
                      })}
                    </div>
                  )}
                </TabsContent>

                {/* Profile Tab */}
                <TabsContent value="profile">
                  <Card className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold font-serif text-primary">Profile Details</h2>
                      {!editMode ? (
                        <Button
                          variant="outline"
                          onClick={() => setEditMode(true)}
                          className="border-primary text-primary hover:bg-primary/5"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Profile
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setEditMode(false)
                              // Reset form data to current user data
                              if (user) {
                                setFormData({
                                  name: user.name,
                                  email: user.email,
                                  phone: user.phone || "",
                                  address: user.address || "",
                                  currentPassword: "",
                                  newPassword: "",
                                  confirmPassword: ""
                                })
                              }
                              setPasswordError("")
                            }}
                          >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            form="profile-form"
                            disabled={updating}
                            className="bg-primary hover:bg-primary/90"
                          >
                            {updating ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Check className="w-4 h-4 mr-2" />
                            )}
                            Save Changes
                          </Button>
                        </div>
                      )}
                    </div>

                    {editMode ? (
                      <form id="profile-form" onSubmit={handleProfileUpdate} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Full Name <span className="text-red-500">*</span>
                            </label>
                            <Input
                              value={formData.name}
                              onChange={(e) => setFormData({...formData, name: e.target.value})}
                              required
                              disabled={updating}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Email
                            </label>
                            <Input
                              type="email"
                              value={formData.email}
                              disabled
                              className="bg-gray-50"
                            />
                            <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Phone Number <span className="text-red-500">*</span>
                            </label>
                            <Input
                              value={formData.phone}
                              onChange={(e) => setFormData({...formData, phone: e.target.value})}
                              required
                              disabled={updating}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Address <span className="text-red-500">*</span>
                            </label>
                            <Input
                              value={formData.address}
                              onChange={(e) => setFormData({...formData, address: e.target.value})}
                              required
                              disabled={updating}
                            />
                          </div>
                        </div>

                        {/* Password Change Section */}
                        <div className="space-y-4 pt-6 border-t">
                          <div className="flex items-center gap-2">
                            <Key className="w-5 h-5 text-primary" />
                            <h3 className="font-medium">Change Password</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Leave password fields blank if you don't want to change your password
                          </p>
                          
                          {passwordError && (
                            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                              {passwordError}
                            </div>
                          )}
                          
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">Current Password</label>
                              <Input
                                type="password"
                                placeholder="Enter current password"
                                value={formData.currentPassword}
                                onChange={(e) => {
                                  setFormData({...formData, currentPassword: e.target.value})
                                  setPasswordError("")
                                }}
                                disabled={updating}
                              />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-2">New Password</label>
                                <Input
                                  type="password"
                                  placeholder="Enter new password"
                                  value={formData.newPassword}
                                  onChange={(e) => {
                                    setFormData({...formData, newPassword: e.target.value})
                                    setPasswordError("")
                                  }}
                                  disabled={updating}
                                />
                                <p className="text-xs text-muted-foreground mt-1">Minimum 6 characters</p>
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                                <Input
                                  type="password"
                                  placeholder="Confirm new password"
                                  value={formData.confirmPassword}
                                  onChange={(e) => {
                                    setFormData({...formData, confirmPassword: e.target.value})
                                    setPasswordError("")
                                  }}
                                  disabled={updating}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <UserIcon className="w-4 h-4" />
                              <span className="text-sm">Full Name</span>
                            </div>
                            <p className="font-medium text-lg">{user.name}</p>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Mail className="w-4 h-4" />
                              <span className="text-sm">Email</span>
                            </div>
                            <p className="font-medium text-lg">{user.email}</p>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Phone className="w-4 h-4" />
                              <span className="text-sm">Phone</span>
                            </div>
                            <p className="font-medium text-lg">{user.phone || 'Not provided'}</p>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MapPin className="w-4 h-4" />
                              <span className="text-sm">Address</span>
                            </div>
                            <p className="font-medium text-lg">{user.address || 'Not provided'}</p>
                          </div>
                        </div>
                        
                        <div className="pt-6 border-t">
                          <h3 className="font-medium mb-3">Account Information</h3>
                          <div className="grid md:grid-cols-3 gap-4">
                            <div className="p-4 bg-secondary/10 rounded-lg">
                              <p className="text-sm text-muted-foreground">Member Since</p>
                              <p className="font-medium">
                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                              </p>
                            </div>
                            <div className="p-4 bg-secondary/10 rounded-lg">
                              <p className="text-sm text-muted-foreground">Account Type</p>
                              <p className="font-medium">
                                {user.role === 'admin' ? 'Administrator' : 'Regular User'}
                              </p>
                            </div>
                            <div className="p-4 bg-secondary/10 rounded-lg">
                              <p className="text-sm text-muted-foreground">Total Orders</p>
                              <p className="font-medium">{getTotalOrders()}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}