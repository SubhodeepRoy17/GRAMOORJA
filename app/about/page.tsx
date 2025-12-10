"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Award, Leaf, Clock, Users, Shield } from "lucide-react"
import Image from "next/image"

export default function AboutPage() {
  const values = [
    {
      icon: <Award className="w-8 h-8" />,
      title: "Quality First",
      description: "Premium ingredients, handcrafted with care and traditional techniques",
      color: "text-blue-500"
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "Natural Ingredients",
      description: "100% natural, organic ingredients sourced from trusted farmers",
      color: "text-green-500"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Timely Delivery",
      description: "Fresh sweets delivered to your doorstep within 24-48 hours",
      color: "text-orange-500"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Made with Love",
      description: "Each sweet is crafted with passion and traditional family recipes",
      color: "text-red-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Focused",
      description: "Supporting local artisans and preserving culinary heritage",
      color: "text-purple-500"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Quality Assurance",
      description: "Rigorous quality checks at every stage of production",
      color: "text-amber-500"
    }
  ]

  const milestones = [
    { year: "2018", title: "Journey Begins", description: "Started in a small kitchen with family recipes" },
    { year: "2019", title: "First 1000 Customers", description: "Reached our first major milestone" },
    { year: "2020", title: "Online Platform", description: "Launched our e-commerce website" },
    { year: "2021", title: "National Recognition", description: "Featured in Food & Culture Magazine" },
    { year: "2022", title: "AI Integration", description: "Implemented smart inventory and delivery systems" },
    { year: "2023", title: "50K+ Happy Customers", description: "Serving sweets across India" }
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Hero Section with Parallax Effect */}
        <section className="relative py-24 px-4 overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium">
                <Heart className="w-4 h-4" />
                Since 2025
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-serif text-primary">
                Our <span className="text-secondary">Delicious</span> Story
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Preserving century-old traditions while innovating for modern tastes. 
                Every sweet tells a story of heritage, passion, and culinary excellence.
              </p>
            </div>
          </div>
        </section>

        {/* Founder's Story */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                    <div className="w-12 h-0.5 bg-primary"></div>
                    OUR JOURNEY
                  </div>
                  <h2 className="text-4xl font-bold font-serif text-primary">From Family Kitchen to Your Home</h2>
                </div>
                
                <div className="space-y-4 text-lg leading-relaxed">
                  <p>
                    Ghoroa Delights began in a humble kitchen where Mrs. Banerjee would lovingly prepare traditional 
                    <span className="font-semibold text-primary"> Kanakchur Muri Ladoo</span> for family and friends. 
                    What started as a passion project soon became a mission to preserve Bengal's rich culinary heritage.
                  </p>
                  <p>
                    Today, we combine <span className="font-semibold text-primary">traditional craftsmanship</span> with 
                    <span className="font-semibold text-primary"> modern technology</span> to bring you sweets that retain 
                    their authentic taste while ensuring freshness and quality in every bite.
                  </p>
                  <p>
                    Our AI-powered platform monitors everything from ingredient sourcing to delivery routes, 
                    ensuring you receive the perfect sweet at the perfect moment.
                  </p>
                </div>

                <div className="flex flex-wrap gap-4">
                  <Button className="bg-primary hover:bg-primary/90">
                    Shop Our Collection
                  </Button>
                  <Button variant="outline">
                    Meet Our Artisans
                  </Button>
                </div>
              </div>

              <div className="relative">
                <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src="./about-hero.jpg"
                    alt="Traditional sweet making process"
                    width={600}
                    height={600}
                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-background p-6 rounded-2xl shadow-xl">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary">5+</div>
                    <div className="text-sm text-muted-foreground">Years of Excellence</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 px-4 bg-secondary/5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold font-serif text-primary mb-4">Our Core Values</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                The principles that guide every sweet we make
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-primary/10">
                  <div className={`${value.color} mb-4`}>
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold font-serif text-primary">
                Taste the Tradition
              </h2>
              <p className="text-xl text-muted-foreground">
                Experience authentic Bengali sweets made with love and delivered with care
              </p>
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90 px-8">
                Order Now
              </Button>
              <Button size="lg" variant="outline" className="px-8">
                Contact Us
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}