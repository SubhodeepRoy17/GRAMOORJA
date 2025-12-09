import { Button } from "@/components/ui/button"

export function FinalCTA() {
  return (
    <section className="w-full py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/95 via-primary/90 to-secondary/95">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
          Experience the Future of Traditional Sweets
        </h2>
        <p className="text-lg text-primary-foreground/90 mb-8 leading-relaxed">
          Join thousands of customers and shop owners already enjoying the perfect blend of heritage and innovation
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
            Start Ordering as Customer
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
          >
            Register Your Shop as Admin
          </Button>
        </div>
      </div>
    </section>
  )
}
