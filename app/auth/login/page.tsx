"use client"

import type React from "react"
import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { toast } from "sonner"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.error || 'Login failed')
        toast.error(data.error || 'Login failed')
        setLoading(false)
        return
      }

      // Show success toast
      toast.success('Login successful!')
      
      // Check for redirect parameter
      const urlParams = new URLSearchParams(window.location.search)
      const redirectTo = urlParams.get('redirect')
      
      // Wait for toast to show
      setTimeout(() => {
        // Redirect based on user role and redirect parameter
        window.location.href = redirectTo || '/'
      }, 1000)
      
    } catch (err) {
      console.error('Login error:', err)
      setError('Login failed. Please try again.')
      toast.error('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-md mx-auto">
          <Card className="p-8 space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold font-serif text-primary">Welcome Back</h1>
              <p className="text-muted-foreground">Sign in to your Ghoroa Delights account</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded">{error}</div>}

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
                {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </form>

            <div className="text-center text-sm">
              Don't have an account?{" "}
              <Link href="/auth/signup" className="text-primary hover:underline font-medium">
                Create one
              </Link>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  )
}