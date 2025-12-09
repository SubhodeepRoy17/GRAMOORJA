import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, Map, Zap, Lightbulb } from "lucide-react"

export function BusinessDashboard() {
  const features = [
    {
      icon: Map,
      title: "City-wise Order Heatmaps",
      description: "Visualize demand patterns across regions",
    },
    {
      icon: TrendingUp,
      title: "Sentiment Analysis",
      description: "AI-powered review insights for authenticity",
    },
    {
      icon: Zap,
      title: "Delivery Optimization",
      description: "Smart routing and efficiency improvements",
    },
    {
      icon: Lightbulb,
      title: "Trend Forecasting",
      description: "Predict demand and optimize inventory",
    },
  ]

  return (
    <section id="business" className="w-full py-20 md:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          {/* Content */}
          <div className="space-y-6">
            <h2 className="font-serif text-4xl md:text-5xl font-bold">Grow Your Business with Analytics</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Unlock powerful insights designed specifically for sweet shop owners. Make data-driven decisions to
              optimize operations and maximize growth.
            </p>

            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto">
              Explore Business Dashboard
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, idx) => (
              <Card key={idx} className="p-6 hover:shadow-lg transition-all">
                <feature.icon className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold text-sm mb-2">{feature.title}</h3>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
