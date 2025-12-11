"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, ShoppingCart, User, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import { toast } from "sonner"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true) // Start with loading true
  const router = useRouter()
  const pathname = usePathname()

  const checkAuthStatus = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/auth/verify', {
        method: 'GET',
        credentials: 'include', // THIS IS CRITICAL
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      console.log('Verify response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Verify response data:', data)
        
        if (data.success && data.user) {
          setUser(data.user)
          setIsLoggedIn(true)
        } else {
          setIsLoggedIn(false)
          setUser(null)
        }
      } else {
        console.log('Verify failed with status:', response.status)
        setIsLoggedIn(false)
        setUser(null)
      }
    } catch (error) {
      console.error('Auth check error:', error)
      setIsLoggedIn(false)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuthStatus()
  }, [pathname])

  const handleLogout = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include', // THIS IS CRITICAL
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      console.log('Logout response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Logout response data:', data)
        
        toast.success('Logged out successfully')
        setIsLoggedIn(false)
        setUser(null)
        setIsOpen(false)
        
        // Force a full page reload to clear any cached state
        window.location.href = '/'
      } else {
        toast.error('Logout failed')
      }
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Logout failed')
      setIsLoggedIn(false)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsOpen(false)
    if (!isLoggedIn) {
      router.push("/auth/login?redirect=/cart")
    } else {
      router.push("/cart")
    }
  }

  const handleAccountClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsOpen(false)
    if (!isLoggedIn) {
      router.push("/auth/login?redirect=/account")
    } else {
      if (user?.role === 'admin') {
        router.push("/admin")
      } else {
        router.push("/account")
      }
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-15 h-15 relative">
              <Image
                src="/logo.png"
                alt="Ghoroa Delights Logo"
                fill
                className="object-contain"
                sizes="112px"
              />
            </div>
            <span className="hidden sm:inline font-serif font-bold text-lg text-primary">Ghoroa Delights</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/shop" className="text-sm font-medium hover:text-primary transition-colors">
              Shop
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
              Contact
            </Link>
            <Link href="/blog" className="text-sm font-medium hover:text-primary transition-colors">
              Blog
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button 
              onClick={handleCartClick} 
              className="p-2 hover:bg-accent rounded-md transition-colors relative"
              disabled={loading}
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
            
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            ) : isLoggedIn ? (
              <>
                <Button 
                  variant="outline" 
                  className="border-primary text-primary hover:bg-primary/5 bg-transparent"
                  onClick={handleAccountClick}
                  disabled={loading}
                >
                  <User className="w-4 h-4 mr-2" />
                  {user?.name?.split(' ')[0] || 'Account'}
                </Button>
                <Button
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-50 bg-transparent"
                  onClick={handleLogout}
                  disabled={loading}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button 
                    variant="outline" 
                    className="border-primary text-primary hover:bg-primary/5 bg-transparent"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Order Now
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2" 
            onClick={() => setIsOpen(!isOpen)} 
            aria-label="Toggle menu"
            disabled={loading}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden pb-4 border-t border-border pt-4">
            <div className="flex flex-col gap-3">
              <Link href="/shop" className="text-sm font-medium hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>
                Shop
              </Link>
              <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>
                About
              </Link>
              <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>
                Contact
              </Link>
              <Link href="/blog" className="text-sm font-medium hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>
                Blog
              </Link>
              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleCartClick}
                  disabled={loading}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Cart
                </Button>
                
                {loading ? (
                  <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  </div>
                ) : isLoggedIn ? (
                  <>
                    <Button 
                      variant="outline" 
                      className="w-full border-primary text-primary hover:bg-primary/5 bg-transparent"
                      onClick={handleAccountClick}
                      disabled={loading}
                    >
                      <User className="w-4 h-4 mr-2" />
                      {user?.name?.split(' ')[0] || 'Account'}
                    </Button>
                    <Button 
                      className="w-full bg-red-600 hover:bg-red-700 text-white" 
                      onClick={handleLogout}
                      disabled={loading}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" className="w-full" onClick={() => setIsOpen(false)}>
                      <Button 
                        variant="outline" 
                        className="w-full border-primary text-primary hover:bg-primary/5 bg-transparent"
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/signup" className="w-full" onClick={() => setIsOpen(false)}>
                      <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                        Order Now
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}