"use client"

import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"
import { useState, useEffect } from "react"

export function Reviews() {
  const [currentReview, setCurrentReview] = useState(0)

  const reviews = [
    {
      name: "Priya Sharma",
      role: "Food Enthusiast",
      rating: 5,
      text: "Absolutely divine! The quality and taste are exactly as I remembered from my childhood. The tracking feature makes everything so convenient.",
      sentiment: "positive",
    },
    {
      name: "Rajesh Kumar",
      role: "Busy Professional",
      rating: 5,
      text: "Love how easy it is to order and track. The nutrition insights help me make better choices. Highly recommended!",
      sentiment: "positive",
    },
    {
      name: "Anjali Patel",
      role: "Wellness Coach",
      rating: 4,
      text: "Great taste and the AI-powered recommendations are spot on. Definitely ordering again for my clients.",
      sentiment: "positive",
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section id="reviews" className="w-full py-20 md:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">Loved by Customers</h2>
          <p className="text-lg text-muted-foreground">Real experiences from real people</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review, idx) => (
            <Card
              key={idx}
              className={`p-6 transition-all duration-500 cursor-pointer ${
                idx === currentReview ? "ring-2 ring-primary shadow-lg" : "hover:shadow-md"
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-foreground">{review.name}</h3>
                  <p className="text-sm text-muted-foreground">{review.role}</p>
                </div>
                <div
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    review.sentiment === "positive"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                  }`}
                >
                  {review.sentiment === "positive" ? "✓ Positive" : "Neutral"}
                </div>
              </div>

              <div className="flex gap-1 mb-4">
                {Array(review.rating)
                  .fill(0)
                  .map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
              </div>

              <p className="text-muted-foreground leading-relaxed">{review.text}</p>
            </Card>
          ))}
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {reviews.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentReview(idx)}
              className={`w-2 h-2 rounded-full transition-all ${idx === currentReview ? "bg-primary w-8" : "bg-muted"}`}
              aria-label={`Go to review ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
