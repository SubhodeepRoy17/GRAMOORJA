"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function NutritionIntelligence() {
  const [selectedSweet, setSelectedSweet] = useState("ladoo")

  const nutritionData = {
    ladoo: { calories: 180, sugar: 12, protein: 3, fat: 9 },
    rasgulla: { calories: 160, sugar: 15, protein: 2, fat: 4 },
    sandesh: { calories: 200, sugar: 14, protein: 5, fat: 11 },
  }

  const current = nutritionData[selectedSweet as keyof typeof nutritionData]

  return (
    <section className="w-full py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">Smart Nutrition Insights</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Make informed choices with AI-powered nutrition analysis and comparison
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Comparison */}
          <div className="space-y-6">
            <div className="flex gap-2">
              {["ladoo", "rasgulla", "sandesh"].map((sweet) => (
                <Button
                  key={sweet}
                  onClick={() => setSelectedSweet(sweet)}
                  className={`capitalize transition-all ${
                    selectedSweet === sweet
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                >
                  {sweet === "ladoo" ? "Muri Ladoo" : sweet}
                </Button>
              ))}
            </div>

            <div className="space-y-4">
              {[
                { label: "Calories", value: current.calories, color: "from-primary" },
                { label: "Sugar (g)", value: current.sugar, color: "from-secondary" },
                { label: "Protein (g)", value: current.protein, color: "from-accent" },
                { label: "Fat (g)", value: current.fat, color: "from-primary/70" },
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-foreground">{item.label}</span>
                    <span className="font-bold text-primary">{item.value}g</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className={`bg-gradient-to-r ${item.color} to-transparent h-full transition-all duration-500`}
                      style={{ width: `${Math.min(item.value * 5, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual */}
          <Card className="p-8 bg-gradient-to-br from-primary/10 to-secondary/10 border-border flex items-center justify-center min-h-80">
            <div className="text-center">
              <div className="w-40 h-40 mx-auto mb-6 relative">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-muted"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray={`${(current.calories / 200) * 282.74} 282.74`}
                    className="text-primary transition-all duration-500"
                    style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary">{current.calories}</div>
                    <div className="text-sm text-muted-foreground">per serving</div>
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground">Nutritional breakdown</p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
