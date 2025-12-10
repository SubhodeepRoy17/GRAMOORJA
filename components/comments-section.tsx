"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Heart, MessageCircle, Star } from "lucide-react"
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa"

// ENHANCED SENTIMENT ANALYZER WITH MORE VARIATIONS
function analyzeSentiment(text: string) {
  const positiveWords = [
    // Quality & Excellence
    "good", "great", "amazing", "excellent", "outstanding", "superb", "fantastic", "wonderful",
    "awesome", "brilliant", "perfect", "phenomenal", "splendid", "terrific", "remarkable",
    "exceptional", "magnificent", "fabulous", "marvelous", "stellar", "top-notch", "premium",
    
    // Taste & Flavor
    "tasty", "delicious", "yummy", "scrumptious", "delectable", "flavorful", "savory", "mouthwatering",
    "appetizing", "palatable", "succulent", "juicy", "sweet", "rich", "creamy", "buttery", "aromatic",
    "fresh", "authentic", "traditional", "homemade", "artisanal", "handcrafted",
    
    // Experience & Service
    "love", "adore", "enjoy", "cherish", "treasure", "favorite", "best", "recommend", "must-try",
    "worth", "valuable", "satisfying", "pleasing", "delightful", "enjoyable", "pleasurable",
    "memorable", "unforgettable", "extraordinary", "unique", "special", "exclusive",
    
    // Health & Ingredients
    "healthy", "nutritious", "wholesome", "organic", "natural", "fresh", "pure", "clean",
    "authentic", "traditional", "herbal", "ayurvedic", "medicinal", "beneficial", "healing",
    
    // Packaging & Delivery
    "beautiful", "elegant", "attractive", "professional", "secure", "fast", "quick", "timely",
    "prompt", "efficient", "reliable", "trustworthy", "consistent", "dependable", "smooth",
    
    // Emotional
    "happy", "joy", "bliss", "ecstatic", "thrilled", "excited", "satisfied", "content",
    "grateful", "thankful", "appreciate", "blessed", "lucky", "fortunate",
    
    // Comparative
    "better", "improved", "enhanced", "upgraded", "superior", "premium", "luxurious", "gourmet",
    "artisanal", "handmade", "crafted", "custom", "personalized",
    
    // Specific to sweets
    "crunchy", "crispy", "soft", "moist", "melting", "smooth", "creamy", "buttery",
    "fragrant", "aromatic", "floral", "spiced", "balanced", "perfectly sweet", "not too sweet",
    "addictive", "irresistible", "crave-worthy", "must-have", "staple", "regular",
    
    // Service & Support
    "helpful", "friendly", "courteous", "polite", "knowledgeable", "responsive", "attentive",
    "caring", "thoughtful", "generous", "accommodating", "flexible", "understanding"
  ]

  const negativeWords = [
    // Quality Issues
    "bad", "poor", "terrible", "awful", "horrible", "disappointing", "unpleasant", "mediocre",
    "subpar", "inferior", "low-quality", "cheap", "tasteless", "bland", "flavorless", "boring",
    "uninspiring", "ordinary", "average", "meh", "okay", "so-so", "nothing special",
    
    // Taste Problems
    "stale", "old", "rancid", "sour", "bitter", "salty", "spicy", "overcooked", "undercooked",
    "burnt", "charred", "raw", "unripe", "overripe", "fermented", "spoiled", "rotten",
    "artificial", "chemical", "processed", "synthetic", "fake", "imitation",
    
    // Too Much/Little
    "too sweet", "overly sweet", "excessively sweet", "cloying", "sickening", "nauseating",
    "too salty", "too spicy", "too bland", "too dry", "too moist", "too hard", "too soft",
    "too small", "too big", "uneven", "inconsistent", "variable", "unreliable",
    
    // Emotional
    "hate", "dislike", "detest", "loathe", "despise", "regret", "disappointed", "upset",
    "angry", "frustrated", "annoyed", "irritated", "disgusted", "repulsed", "offended",
    
    // Service Issues
    "late", "delayed", "slow", "tardy", "unreliable", "inconsistent", "poor service",
    "rude", "impolite", "unhelpful", "unresponsive", "ignorant", "incompetent", "careless",
    "negligent", "sloppy", "messy", "dirty", "unclean", "unhygienic",
    
    // Packaging & Delivery
    "damaged", "broken", "crushed", "smashed", "torn", "ripped", "leaking", "spilled",
    "melted", "spoiled", "warm", "hot", "cold", "frozen", "improper", "wrong", "incorrect",
    "missing", "incomplete", "partial", "short", "less", "underweight",
    
    // Health Concerns
    "unhealthy", "fatty", "greasy", "oily", "heavy", "indigestible", "upset stomach",
    "allergic", "reaction", "rash", "sick", "ill", "poisonous", "contaminated",
    
    // Value & Price
    "expensive", "overpriced", "costly", "pricey", "not worth", "waste", "wasted", "useless",
    "pointless", "meaningless", "unnecessary", "excessive", "extravagant", "luxury",
    
    // Specific Issues
    "hard", "tough", "chewy", "rubbery", "gummy", "sticky", "gooey", "slimy", "mushy",
    "soggy", "wet", "dry", "crumbly", "powdery", "grainy", "sandy", "gritty",
    "burnt taste", "smoky", "charred", "bitter aftertaste", "unpleasant aftertaste",
    
    // Expectations
    "not as described", "different", "unexpected", "surprising", "shocking", "unbelievable",
    "false", "misleading", "deceptive", "fraud", "scam", "cheat", "trick",
    
    // Comparative
    "worse", "inferior", "poorer", "weaker", "lesser", "cheaper", "lower quality"
  ]

  const t = text.toLowerCase()
  let score = 0
  
  // Check for positive words with weights
  positiveWords.forEach((w) => {
    if (t.includes(w.toLowerCase())) {
      if (["love", "best", "perfect", "excellent", "amazing"].includes(w)) {
        score += 2
      } else if (["great", "wonderful", "fantastic", "outstanding"].includes(w)) {
        score += 1.5
      } else {
        score += 1
      }
    }
  })
  
  // Check for negative words with weights
  negativeWords.forEach((w) => {
    if (t.includes(w.toLowerCase())) {
      if (["hate", "worst", "terrible", "awful", "disgusting"].includes(w)) {
        score -= 2
      } else if (["bad", "poor", "disappointing", "unpleasant"].includes(w)) {
        score -= 1.5
      } else {
        score -= 1
      }
    }
  })
  
  // Check for negations
  const negations = ["not ", "no ", "never ", "don't ", "doesn't ", "didn't ", "isn't ", "aren't ", "wasn't ", "weren't "]
  negations.forEach((neg) => {
    if (t.includes(neg)) {
      positiveWords.forEach((pw) => {
        if (t.includes(neg + pw.toLowerCase())) {
          score -= 1.5
        }
      })
      negativeWords.forEach((nw) => {
        if (t.includes(neg + nw.toLowerCase())) {
          score += 1
        }
      })
    }
  })
  
  // Determine sentiment based on score
  if (score > 2) return "Very Positive"
  if (score > 0) return "Positive"
  if (score < -2) return "Very Negative"
  if (score < 0) return "Negative"
  return "Neutral"
}

export function CommentsSection() {
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState("")
  const [name, setName] = useState("")
  const [rating, setRating] = useState(5)
  const [liked, setLiked] = useState<number[]>([])
  const [activeTab, setActiveTab] = useState<"all" | "positive" | "negative">("all")

  // INSIGHT DATA
  const [positivePercent, setPositivePercent] = useState(0)
  const [negativePercent, setNegativePercent] = useState(0)
  const [topPositive, setTopPositive] = useState<string[]>([])
  const [topNegative, setTopNegative] = useState<string[]>([])

  // LOAD COMMENTS
  useEffect(() => {
    const stored = localStorage.getItem("comments")
    if (stored) {
      try {
        const arr = JSON.parse(stored)
        setComments(arr)
        updateInsights(arr)
      } catch (error) {
        console.error("Failed to parse comments from localStorage:", error)
      }
    }
  }, [])

  // UPDATE INSIGHTS
  const updateInsights = (list: any[]) => {
    const pos = list.filter((c) => c.sentiment === "Positive" || c.sentiment === "Very Positive")
    const neg = list.filter((c) => c.sentiment === "Negative" || c.sentiment === "Very Negative")
    const total = list.length

    setPositivePercent(total ? (pos.length / total) * 100 : 0)
    setNegativePercent(total ? (neg.length / total) * 100 : 0)

    setTopPositive(pos.slice(0, 5).map((c) => c.text))
    setTopNegative(neg.slice(0, 5).map((c) => c.text))
  }

  // ADD COMMENT
  const handleAddComment = () => {
    if (!newComment.trim() || !name.trim()) return

    const sentiment = analyzeSentiment(newComment)

    const comment = {
      id: Date.now(),
      name,
      text: newComment,
      rating,
      sentiment,
      timestamp: new Date().toLocaleDateString(),
      likes: 0,
    }

    const updated = [comment, ...comments]
    setComments(updated)
    localStorage.setItem("comments", JSON.stringify(updated))

    updateInsights(updated)

    setNewComment("")
    setName("")
    setRating(5)
  }

  // LIKE BUTTON
  const toggleLike = (id: number) => {
    if (liked.includes(id)) {
      setLiked(liked.filter((i) => i !== id))
    } else {
      setLiked([...liked, id])
    }
  }

  // FILTERS FOR TABS
  const filteredComments =
    activeTab === "all"
      ? comments
      : comments.filter((c) => {
          if (activeTab === "positive") {
            return c.sentiment === "Positive" || c.sentiment === "Very Positive"
          } else {
            return c.sentiment === "Negative" || c.sentiment === "Very Negative"
          }
        })

  return (
    <section className="w-full py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-secondary/5">
      <div className="max-w-7xl mx-auto">

        {/* TITLE */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">Share Your Thoughts</h2>
          <p className="text-lg text-muted-foreground">Help us improve by sharing your feedback</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* COMMENT INPUT */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="text-xl font-semibold mb-4">Leave a Comment</h3>

              <div className="space-y-4">

                {/* NAME */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  />
                </div>

                {/* RATING */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        type="button"
                        className={`text-2xl transition ${star <= rating ? "text-primary" : "text-muted-foreground"}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                {/* COMMENT */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Your Comment</label>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your experience..."
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background resize-none h-24"
                  />
                </div>

                {/* POST BUTTON */}
                <Button
                  onClick={handleAddComment}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Post Comment
                </Button>
              </div>
            </Card>
          </div>

          {/* RIGHT SIDE — INSIGHTS + COMMENTS */}
          <div className="lg:col-span-2 space-y-6">

            {/* INSIGHT BOX */}
            <Card className="p-6 border border-border/40">
              <h3 className="text-xl font-semibold mb-4">Comment Insights</h3>

              <div className="flex items-center gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <FaThumbsUp className="w-5 h-5 text-green-500" />
                  <p className="text-sm">
                    Positive: <strong>{positivePercent.toFixed(1)}%</strong>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <FaThumbsDown className="w-5 h-5 text-red-500" />
                  <p className="text-sm">
                    Negative: <strong>{negativePercent.toFixed(1)}%</strong>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* POSITIVE INSIGHTS */}
                <div>
                  <h4 className="font-semibold mb-2">What Positive Users Say</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {topPositive.length === 0 ? (
                      <li>No positive comments yet</li>
                    ) : (
                      topPositive.map((t, i) => <li key={i}>• {t}</li>)
                    )}
                  </ul>
                </div>

                {/* NEGATIVE INSIGHTS */}
                <div>
                  <h4 className="font-semibold mb-2">What Negative Users Say</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {topNegative.length === 0 ? (
                      <li>No negative comments yet</li>
                    ) : (
                      topNegative.map((t, i) => <li key={i}>• {t}</li>)
                    )}
                  </ul>
                </div>
              </div>
            </Card>

            {/* TABS */}
            <div className="flex gap-4">
              <button
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === "all" 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-background border hover:bg-secondary/20"
                }`}
                onClick={() => setActiveTab("all")}
                type="button"
              >
                All
              </button>
              <button
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === "positive" 
                    ? "bg-green-500 text-white" 
                    : "bg-background border hover:bg-secondary/20"
                }`}
                onClick={() => setActiveTab("positive")}
                type="button"
              >
                Positive
              </button>
              <button
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === "negative" 
                    ? "bg-red-500 text-white" 
                    : "bg-background border hover:bg-secondary/20"
                }`}
                onClick={() => setActiveTab("negative")}
                type="button"
              >
                Negative
              </button>
            </div>

            {/* COMMENT LIST */}
            {filteredComments.length === 0 ? (
              <Card className="p-12 text-center">
                <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No comments yet.</p>
              </Card>
            ) : (
              filteredComments.map((comment) => (
                <Card
                  key={comment.id}
                  className={`p-6 hover:shadow-lg transition-shadow border-2 ${
                    comment.sentiment === "Positive" || comment.sentiment === "Very Positive"
                      ? "border-green-400/30 hover:border-green-400" 
                      : "border-red-400/30 hover:border-red-400"
                  }`}
                >
                  {/* TOP INFO */}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold">{comment.name}</h4>
                      <p className="text-xs text-muted-foreground">{comment.timestamp}</p>
                    </div>

                    {/* RATING */}
                    <div className="flex gap-1">
                      {Array(comment.rating)
                        .fill(0)
                        .map((_, i) => (
                          <span key={i} className="text-primary text-sm">
                            ★
                          </span>
                        ))}
                    </div>
                  </div>

                  {/* TEXT */}
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {comment.text}
                  </p>

                  {/* SENTIMENT BADGE */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-2">
                      {(comment.sentiment === "Positive" || comment.sentiment === "Very Positive") ? (
                        <FaThumbsUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <FaThumbsDown className="w-4 h-4 text-red-500" />
                      )}
                      <span className={`text-xs font-medium px-2 py-1 rounded ${
                        comment.sentiment === "Very Positive" ? "bg-green-100 text-green-800" :
                        comment.sentiment === "Positive" ? "bg-green-50 text-green-700" :
                        comment.sentiment === "Very Negative" ? "bg-red-100 text-red-800" :
                        "bg-red-50 text-red-700"
                      }`}>
                        {comment.sentiment}
                      </span>
                    </div>

                    {/* LIKE BUTTON */}
                    <button
                      onClick={() => toggleLike(comment.id)}
                      type="button"
                      className={`flex items-center gap-2 text-sm transition-colors ${
                        liked.includes(comment.id)
                          ? "text-primary"
                          : "text-muted-foreground hover:text-primary"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${liked.includes(comment.id) ? "fill-current" : ""}`} />
                      Helpful
                    </button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}