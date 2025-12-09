import { Card } from "@/components/ui/card"
import { Sparkles, Zap, Layout } from "lucide-react"

export function ValueProps() {
  const props = [
    {
      icon: Sparkles,
      title: "Traditional Craftsmanship",
      description:
        "Authentic Kanakchur Muri Ladoo recipe passed down through generations, made with premium ingredients",
    },
    {
      icon: Zap,
      title: "AI-Powered Experience",
      description: "Smart ordering, real-time tracking, and personalized nutrition insights powered by advanced AI",
    },
    {
      icon: Layout,
      title: "Seamless Dashboard",
      description: "All-in-one order management with live tracking, order history, and customer preferences",
    },
  ]

  return (
    <section id="features" className="w-full py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">Why Choose GramoOrja?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We blend time-tested traditions with cutting-edge technology for an unmatched experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {props.map((prop, idx) => (
            <Card
              key={idx}
              className="p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-card border-border"
            >
              <prop.icon className="w-12 h-12 text-primary mb-4" />
              <h3 className="font-serif text-xl font-bold mb-3">{prop.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{prop.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
