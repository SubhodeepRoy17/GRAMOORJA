"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, ShoppingCart, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem("user")
    setIsLoggedIn(!!user)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    setIsLoggedIn(false)
    router.push("/")
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
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="w-5 h-5" />
              </Button>
            </Link>
            {isLoggedIn ? (
              <>
                <Link href="/account">
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary/5 bg-transparent">
                    <User className="w-4 h-4 mr-2" />
                    Account
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/5 bg-transparent"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary/5 bg-transparent">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Order Now</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden pb-4 border-t border-border pt-4">
            <div className="flex flex-col gap-3">
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
              <div className="flex gap-2 pt-2">
                {isLoggedIn ? (
                  <>
                    <Link href="/account" className="flex-1">
                      <Button
                        variant="outline"
                        className="w-full border-primary text-primary hover:bg-primary/5 bg-transparent"
                      >
                        Account
                      </Button>
                    </Link>
                    <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white" onClick={handleLogout}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" className="flex-1">
                      <Button
                        variant="outline"
                        className="w-full border-primary text-primary hover:bg-primary/5 bg-transparent"
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/signup" className="flex-1">
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
