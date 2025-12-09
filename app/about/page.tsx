"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="py-16 px-4 bg-gradient-to-b from-secondary/10 to-transparent">
          <div className="max-w-7xl mx-auto text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold font-serif text-primary">Our Story</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Bringing heritage sweets to modern homes with care and innovation
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto space-y-8">
            <Card className="p-8 space-y-4">
              <h2 className="text-2xl font-bold font-serif text-primary">About GramoOrja</h2>
              <p className="text-foreground leading-relaxed">
                GramoOrja started with a simple mission: to preserve the traditional craft of making authentic Kanakchur
                Muri Ladoo while bringing it to the modern age. Our founder, inspired by family recipes passed down
                through generations, decided to create a platform where quality meets convenience.
              </p>
              <p className="text-foreground leading-relaxed">
                We believe that traditional sweets should be available to everyone, whether they live next door or
                across the country. Our AI-powered platform ensures freshness, quality, and timely delivery, while
                maintaining the authentic taste that defines our brand.
              </p>
            </Card>

            <Card className="p-8 space-y-4">
              <h2 className="text-2xl font-bold font-serif text-primary">Our Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">✨</div>
                  <h3 className="font-bold mb-2">Quality First</h3>
                  <p className="text-sm text-muted-foreground">Premium ingredients, handcrafted with care</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">🚚</div>
                  <h3 className="font-bold mb-2">Fast Delivery</h3>
                  <p className="text-sm text-muted-foreground">Real-time tracking to your doorstep</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">❤️</div>
                  <h3 className="font-bold mb-2">Tradition</h3>
                  <p className="text-sm text-muted-foreground">Preserving heritage through taste</p>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
