"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mail, Phone, MapPin } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: "", email: "", subject: "", message: "" })
    }, 3000)
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="py-16 px-4 bg-gradient-to-b from-secondary/10 to-transparent">
          <div className="max-w-7xl mx-auto text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold font-serif text-primary">Get in Touch</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">We'd love to hear from you. Send us a message!</p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <Card className="p-6 space-y-3">
                <Mail className="w-8 h-8 text-primary" />
                <h3 className="font-bold">Email</h3>
                <p className="text-muted-foreground">hello@gramoorja.com</p>
              </Card>
              <Card className="p-6 space-y-3">
                <Phone className="w-8 h-8 text-primary" />
                <h3 className="font-bold">Phone</h3>
                <p className="text-muted-foreground">+91 98765 43210</p>
              </Card>
              <Card className="p-6 space-y-3">
                <MapPin className="w-8 h-8 text-primary" />
                <h3 className="font-bold">Address</h3>
                <p className="text-muted-foreground">Bengal Sweets Lane, Kolkata, India</p>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="md:col-span-2">
              <Card className="p-8">
                {submitted ? (
                  <div className="text-center space-y-4 py-12">
                    <div className="text-5xl mb-4">✓</div>
                    <h2 className="text-2xl font-bold text-primary">Message Sent!</h2>
                    <p className="text-muted-foreground">We'll get back to you shortly</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 border border-border rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2 border border-border rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Subject</label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-2 border border-border rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Message</label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-2 border border-border rounded h-32 resize-none"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                      Send Message
                    </Button>
                  </form>
                )}
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
