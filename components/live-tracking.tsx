"use client"

import { Card } from "@/components/ui/card"
import { MapPin, Clock, CheckCircle } from "lucide-react"
import { useState, useEffect } from "react"

export function LiveTracking() {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const steps = [
    { icon: Clock, label: "Order Placed", time: "Now" },
    { icon: MapPin, label: "Being Prepared", time: "5 mins" },
    { icon: CheckCircle, label: "Ready for Delivery", time: "15 mins" },
  ]

  return (
    <section id="tracking" className="w-full py-20 md:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">Real-Time Order Tracking</h2>
          <p className="text-lg text-muted-foreground">Track your order in real-time, no tracking ID needed</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Tracking animation */}
          <Card className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-border min-h-72 flex items-center justify-center">
            <div className="space-y-6 w-full">
              {steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                      idx <= activeStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <step.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{step.label}</p>
                    <p className="text-sm text-muted-foreground">{step.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Description */}
          <div className="space-y-6">
            <h3 className="font-serif text-3xl font-bold">Never Miss an Update</h3>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Our intelligent tracking system keeps you informed at every step of your order journey. From preparation
                to delivery, stay connected with real-time notifications.
              </p>
              <ul className="space-y-3">
                {[
                  "Live order status updates",
                  "Estimated delivery time",
                  "Personalized preparation progress",
                  "Smart delivery notifications",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
