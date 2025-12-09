"use client"

import { Button } from "@/components/ui/button"
import { SparklesIcon, ArrowRightIcon } from "@/components/icons"
import Image from "next/image"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative w-full py-20 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background decoration - STATIC */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl -z-10"></div>

      {/* Wave animation background */}
      <div className="absolute inset-0 overflow-hidden -z-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary/30 via-secondary/20 to-transparent rounded-full wave-animation blur-2xl"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Content - MINIMAL TEXT */}
          <div className="space-y-6 slide-in-up">
            <div className="inline-block">
              <span className="px-4 py-2 bg-secondary/30 text-primary text-sm font-semibold rounded-full border border-secondary/50 flex items-center gap-2">
                <SparklesIcon />
                Tradition Reimagined
              </span>
            </div>

            <h1 className="font-serif text-5xl md:text-6xl font-bold text-balance leading-tight text-foreground">
              Premium <span className="text-primary">Kanakchur Muri Ladoo</span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-sm font-light">
              Heritage sweets crafted with pure ingredients. Smart tracking. Fresh delivery.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-fit shadow-lg hover:shadow-xl transition-all"
                >
                  Order Now
                  <ArrowRightIcon />
                </Button>
              </Link>
              <Link href="/shop">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/5 bg-transparent w-full sm:w-fit"
                >
                  Explore
                </Button>
              </Link>
            </div>
          </div>

          {/* Visual Element - CIRCULAR BORDER LADDOO */}
          <div className="flex justify-center items-center">
            <div className="relative w-80 h-80 md:w-96 md:h-96 float-gentle">
              {/* Outer circle - large background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/25 to-secondary/25 rounded-full blur-3xl"></div>

              {/* Middle animated circle */}
              <div className="absolute inset-0 rounded-full shimmer border-2 border-primary/30"></div>

              {/* Inner circle with laddoo - SMALLER THAN BACKGROUND */}
              <div className="absolute inset-8 md:inset-12 rounded-full border-4 border-primary/60 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center shadow-2xl">
                <Image
                  src="/laddoo.jpg"
                  alt="Kanakchur Muri Ladoo"
                  width={240}
                  height={240}
                  className="w-40 md:w-52 h-40 md:h-52 object-contain drop-shadow-xl rounded-full"
                  priority
                />
              </div>

              {/* Decorative dots around circle */}
              <div className="absolute top-4 right-4 w-3 h-3 bg-primary/40 rounded-full"></div>
              <div className="absolute bottom-4 left-4 w-2 h-2 bg-secondary/40 rounded-full"></div>
              <div className="absolute top-1/2 right-2 w-2 h-2 bg-accent/40 rounded-full transform -translate-y-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
