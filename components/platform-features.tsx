import { Card } from "@/components/ui/card"
import { Package, BarChart3, MessageSquare } from "lucide-react"

export function PlatformFeatures() {
  const features = [
    {
      icon: Package,
      title: "User Dashboard",
      description: "Seamless order interface with saved preferences, order history, and quick reorders",
      image: "📊",
    },
    {
      icon: BarChart3,
      title: "Admin Analytics",
      description: "City-wise order heatmaps and real-time trends to optimize your business",
      image: "📈",
    },
    {
      icon: MessageSquare,
      title: "AI Chatbot",
      description: "Instant customer support with natural language understanding for all queries",
      image: "🤖",
    },
  ]

  return (
    <section className="w-full py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">Powerful Features</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to manage, track, and grow
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <Card key={idx} className="p-8 text-center hover:shadow-lg transition-all">
              <div className="text-6xl mb-4">{feature.image}</div>
              <h3 className="font-serif text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
