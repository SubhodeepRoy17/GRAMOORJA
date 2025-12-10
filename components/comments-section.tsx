"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useEffect, useMemo, useState } from "react"
import { Heart, MessageCircle } from "lucide-react"

// Recharts imports
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

// --- LARGE SENTIMENT LEXICONS EMBEDDED (sampled, extendable) ---
// NOTE: lists below are extensive (hundreds of tokens each). You can expand them if needed.
// For performance we lowercase everything during check.
const positiveWords = [
  "good","great","excellent","amazing","awesome","superb","lovely","love","liked","delicious","tasty","fresh",
  "clean","perfect","nice","pleasant","satisfied","satisfying","pleasantly","recommend","recommendation","recommendable",
  "best","better","worth","worthwhile","value","valuefor","valueable","quality","premium","authentic","organic","natural",
  "healthy","nutritious","crunchy","crispy","soft","fluffy","light","lightweight","refreshing","yummy","fingerlicking",
  "flavourful","flavorful","heavenly","fantastic","phenomenal","spectacular","impressive","joy","joyful","delight","delighted",
  "delightful","pleasantly","enjoy","enjoyed","enjoyable","savor","savory","savoury","savour","satisfy","satisfying",
  "appreciate","appreciated","perfectly","smooth","consistent","authenticity","freshness","homemade","handmade","artisanal",
  "homely","traditional","classic","wholesome","clean-tasting","deluxe","lovely","lovingly","cared","care","careful",
  "onpoint","on point","nicepack","nicely","generous","plenty","valuepack","reliable","dependable","trust","trusted",
  "friendly","fast","prompt","punctual","on-time","ontime","securely","intact","intactly","crisp","crisper","buttery",
  "butterscotch","golden","marvelous","marvellous","tender","succulent","fragrant","fruity","aromatic","floral",
  "balanced","balancedtaste","homestyle","housemade","homemade","kidfriendly","kid-friendly","familyfriendly","family-friendly",
  "guilt-free","guiltfree","lowcalorie","low-calorie","lowfat","low-fat","sugarfree","sugar-free","jaggery","gur","pure",
  "cleanlabel","clean-label","noadditives","nopreservatives","nopreservative","nonfried","airfried","air-fried","ovenbaked",
  "oven-baked","crispyfresh","artisan","local","farmfresh","farm-fresh","community","sourced","sourcedlocally","sustainable",
  "lovelypackaging","beautifulpackaging","giftable","perfectgift","present","treat","treats","celebration","festival","festive",
  "valueforprice","valuefor-money","economical","niceportion","portion","generousportions","economy","saver","savers"
  // ... add more as needed
]

const negativeWords = [
  "bad","worst","awful","terrible","disgusting","stale","stale-taste","stale taste","soggy","soft","hard","rockhard",
  "overcooked","undercooked","burnt","burnt-taste","burnt taste","bland","tasteless","too sweet","too salty","too sour",
  "expensive","overpriced","ripoff","rip-off","thin","small","short","broken","damaged","leaking","leakage","mold","mould",
  "smell","smelly","odor","odour","rutty","rotten","spoiled","spoil","unfresh","notfresh","old","expired","pastdate",
  "cold","not warm","lukewarm","badpackaging","poorpackaging","late","delayed","delay","missing","lost","notreceived",
  "not arrived","disappointed","disappointing","disappointment","refund","return","returned","returning","complaint",
  "complain","problem","issue","issues","worstexperience","neverbuy","never again","regret","regretted","poor","poorly",
  "inconsistent","inconsistency","declined","damagedbox","brokenpack","mishandled","terribleservice","rude","rudeness",
  "notgood","not nice","notnice","nothappy","unhappy","unpleasant","unsatisfied","unsatisfactory","horrible","horrendous",
  "forgettable","sour","bitter","acidic","oily","greasy","grease","too oily","soggy","moisture","moist","waterlogged",
  "mushy","chewy","chew","notfreshness","scam","fake","counterfeit","spoilt","tainted","contaminated","unsafe","allergic",
  "allergy","stomach","sick","upset","vomit","vomited","pain","hurt","sore","sour","burn","burning","sour","cheap","cheaply",
  "worstpack","badpack","noresponse","no reply","no communication","neverreply","no support","unable","cant","can't","cannot"
  // ... add more as needed
]

// Normalize lists to sets for fast lookup
const POS_SET = new Set(positiveWords.map((s) => s.toLowerCase()))
const NEG_SET = new Set(negativeWords.map((s) => s.toLowerCase()))

// Utility to extract top keywords from comment list
function topKeywordsFromComments(comments: any[], sentiment: "Positive" | "Negative", topN = 6) {
  const freq: Record<string, number> = {}
  comments.forEach((c) => {
    if (c.sentiment !== sentiment) return
    const text = (c.text || "").toLowerCase()
    const tokens = text.split(/[^a-z0-9]+/).filter(Boolean)
    tokens.forEach((t: string) => {
      if (t.length <= 2) return
      if (POS_SET.has(t) || NEG_SET.has(t)) {
        freq[t] = (freq[t] || 0) + 1
      }
    })
  })
  const arr = Object.entries(freq).sort((a, b) => b[1] - a[1])
  return arr.slice(0, topN).map((x) => x[0])
}

// Advanced analyzer: handle negation and phrase matching
function analyzeSentiment(text: string): "Positive" | "Negative" {
  if (!text || !text.trim()) return "Positive"

  const t = text.toLowerCase()

  // Quick explicit negative checks
  const explicitNegativePhrases = ["never buy", "never again", "not buying", "do not buy", "do n't buy", "dont buy", "return this", "refund please", "worst ever", "worst experience", "do not order"]
  for (const p of explicitNegativePhrases) {
    if (t.includes(p)) return "Negative"
  }

  // tokenization and sliding window phrase detection
  const tokens = t.split(/[^a-z0-9]+/).filter(Boolean)

  let score = 0

  // weights
  const POS_WEIGHT = 1
  const NEG_WEIGHT = 1.5 // penalize negatives a bit more for business safety

  // check for multi-word phrases first (two-word)
  for (let i = 0; i < tokens.length; i++) {
    const unigram = tokens[i]
    const bigram = i < tokens.length - 1 ? `${tokens[i]} ${tokens[i+1]}` : null

    // negation context: look for "not", "never", "no" within 2 tokens before positive
    const prev2 = (i >= 2 ? `${tokens[i-2]} ${tokens[i-1]}` : "")
    const prev1 = (i >= 1 ? tokens[i-1] : "")

    // bigram check
    if (bigram) {
      if (NEG_SET.has(bigram)) {
        score -= NEG_WEIGHT * 2
        continue
      }
      if (POS_SET.has(bigram)) {
        // if negation before bigram, invert
        if (prev1 === "not" || prev1 === "never" || prev2.includes("not")) {
          score -= POS_WEIGHT * 2
        } else {
          score += POS_WEIGHT * 2
        }
        continue
      }
    }

    // unigram checks
    if (POS_SET.has(unigram)) {
      // check negation proximity
      const negNearby = prev1 === "not" || prev1 === "never" || (i + 1 < tokens.length && tokens[i+1] === "not")
      if (negNearby) {
        score -= POS_WEIGHT
      } else {
        score += POS_WEIGHT
      }
    }

    if (NEG_SET.has(unigram)) {
      // check negation proximity: e.g., "not bad" -> counts positive
      const negNearby = prev1 === "not" || prev1 === "never" || (i + 1 < tokens.length && tokens[i+1] === "not")
      if (negNearby) {
        score += NEG_WEIGHT // "not bad" => positive tilt
      } else {
        score -= NEG_WEIGHT
      }
    }
  }

  // final threshold rules: if score is 0, examine exclamation, emoticons, rating words
  if (score === 0) {
    if (/[!]{1,}/.test(text)) return "Positive"
    const lower = text.toLowerCase()
    if (lower.includes("not good") || lower.includes("not great") || lower.includes("poor") || lower.includes("disappointed")) {
      return "Negative"
    }
    // default to Positive for business
    return "Positive"
  }

  return score > 0 ? "Positive" : "Negative"
}

// initials helper
function initials(name: string) {
  if (!name) return "U"
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

// comment item type
type CommentItem = {
  id: number
  name: string
  text: string
  rating: number
  sentiment: "Positive" | "Negative"
  timestamp: string
  likes: number
}

// COMPONENT
export function CommentsSection() {
  const [comments, setComments] = useState<CommentItem[]>([])
  const [newComment, setNewComment] = useState("")
  const [name, setName] = useState("")
  const [rating, setRating] = useState(5)
  const [likedIds, setLikedIds] = useState<number[]>([])
  const [activeTab, setActiveTab] = useState<"all" | "positive" | "negative">("all")
  const [analyzing, setAnalyzing] = useState(false)

  // load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("comments")
    if (stored) {
      try {
        const arr = JSON.parse(stored)
        setComments(arr)
      } catch {
        setComments([])
      }
    }
  }, [])

  // persist
  useEffect(() => {
    localStorage.setItem("comments", JSON.stringify(comments))
  }, [comments])

  // derived lists & metrics
  const positive = useMemo(() => comments.filter((c) => c.sentiment === "Positive"), [comments])
  const negative = useMemo(() => comments.filter((c) => c.sentiment === "Negative"), [comments])
  const total = comments.length
  const positivePercent = total ? (positive.length / total) * 100 : 0
  const negativePercent = total ? (negative.length / total) * 100 : 0

  // pie chart data for recharts
  const pieData = [
    { name: "Positive", value: positive.length, color: "#10b981" },
    { name: "Negative", value: negative.length, color: "#ef4444" },
  ]

  // top keywords/phrases
  const topPosKeywords = topKeywordsFromComments(comments, "Positive", 6)
  const topNegKeywords = topKeywordsFromComments(comments, "Negative", 6)

  // add comment (client-side sentiment analysis)
  const handleAddComment = () => {
    if (!name.trim() || !newComment.trim()) return
    setAnalyzing(true)
    // synchronous analyzer (fast)
    const sentiment = analyzeSentiment(newComment.trim())
    const comment: CommentItem = {
      id: Date.now(),
      name: name.trim(),
      text: newComment.trim(),
      rating,
      sentiment,
      timestamp: new Date().toLocaleString(),
      likes: 0,
    }
    setComments((p) => [comment, ...p])
    setNewComment("")
    setName("")
    setRating(5)
    setAnalyzing(false)
  }

  const toggleLike = (id: number) => {
    const isLiked = likedIds.includes(id)
    setLikedIds((prev) => 
      isLiked ? prev.filter((x) => x !== id) : [...prev, id]
    )
    setComments((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c
        return { 
          ...c, 
          likes: isLiked ? Math.max(0, c.likes - 1) : c.likes + 1 
        }
      })
    )
  }

  const filteredComments = useMemo(() => {
    if (activeTab === "all") return comments
    return activeTab === "positive" ? positive : negative
  }, [activeTab, comments, positive, negative])

  return (
    <section className="w-full py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-secondary/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">Share Your Thoughts</h2>
          <p className="text-lg text-muted-foreground">Help us improve by sharing your feedback</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="text-xl font-semibold mb-4">Leave a Comment</h3>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-3 py-2 border border-border rounded-lg"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star} 
                        onClick={() => setRating(star)} 
                        className={`text-2xl ${star <= rating ? "text-primary" : "text-muted"}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Your Comment</label>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your experience..."
                    className="w-full px-3 py-2 border border-border rounded-lg resize-none h-24"
                  />
                </div>

                <Button 
                  onClick={handleAddComment} 
                  disabled={!newComment.trim() || !name.trim() || analyzing}
                >
                  {analyzing ? "Analyzing..." : "Post Comment"}
                </Button>
              </div>
            </Card>
          </div>

          {/* Insights + Comments */}
          <div className="lg:col-span-2 space-y-6">
            {/* Insights Card */}
            <Card className="p-6 border border-border/40">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold">Comment Insights</h3>
                  <p className="text-sm text-muted-foreground">Real-time sentiment summary for this product</p>
                </div>

                <div style={{ width: 220, height: 160 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={40}
                        outerRadius={60}
                        paddingAngle={3}
                        label
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Top Positive Keywords</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {topPosKeywords.length === 0 ? 
                      <li>No positive keywords yet</li> : 
                      topPosKeywords.map((k) => <li key={k}>• {k}</li>)
                    }
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Top Negative Keywords</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {topNegKeywords.length === 0 ? 
                      <li>No negative keywords yet</li> : 
                      topNegKeywords.map((k) => <li key={k}>• {k}</li>)
                    }
                  </ul>
                </div>
              </div>

              <div className="mt-4 flex gap-6">
                <div>
                  <div className="text-sm text-muted-foreground">Total Comments</div>
                  <div className="font-semibold text-lg">{total}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Positive</div>
                  <div className="font-semibold text-lg text-green-600">{positivePercent.toFixed(1)}%</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Negative</div>
                  <div className="font-semibold text-lg text-red-600">{negativePercent.toFixed(1)}%</div>
                </div>
              </div>
            </Card>

            {/* Tabs */}
            <div className="flex gap-4">
              <button 
                className={`px-4 py-2 rounded ${activeTab === "all" ? "bg-primary text-white" : "bg-background border"}`} 
                onClick={() => setActiveTab("all")}
              >
                All
              </button>
              <button 
                className={`px-4 py-2 rounded ${activeTab === "positive" ? "bg-green-500 text-white" : "bg-background border"}`} 
                onClick={() => setActiveTab("positive")}
              >
                Positive
              </button>
              <button 
                className={`px-4 py-2 rounded ${activeTab === "negative" ? "bg-red-500 text-white" : "bg-background border"}`} 
                onClick={() => setActiveTab("negative")}
              >
                Negative
              </button>
            </div>

            {/* Comments list */}
            {filteredComments.length === 0 ? (
              <Card className="p-12 text-center">
                <MessageCircle className="w-12 h-12 text-muted mx-auto mb-4" />
                <p className="text-muted-foreground">No comments yet.</p>
              </Card>
            ) : (
              filteredComments.map((c) => (
                <Card 
                  key={c.id} 
                  className={`p-6 hover:shadow-lg transition-shadow border-2 ${c.sentiment === "Positive" ? "border-green-400" : "border-red-400"}`}
                >
                  <div className="flex items-start justify-between mb-3 gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold">
                        {initials(c.name)}
                      </div>
                      <div>
                        <div className="font-semibold">{c.name}</div>
                        <div className="text-xs text-muted-foreground">{c.timestamp}</div>
                      </div>
                    </div>

                    <div className="flex gap-1">
                      {Array.from({ length: c.rating }).map((_, i) => (
                        <span key={i} className="text-primary text-sm">★</span>
                      ))}
                    </div>
                  </div>

                  <p className="mb-4 text-muted-foreground">{c.text}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => toggleLike(c.id)} 
                        className={`flex items-center gap-2 text-sm ${likedIds.includes(c.id) ? "text-primary" : "text-muted-foreground"}`}
                      >
                        <Heart className={`w-4 h-4 ${likedIds.includes(c.id) ? "fill-current" : ""}`} />
                        Helpful ({c.likes})
                      </button>
                      <div className={`text-xs px-2 py-1 rounded ${c.sentiment === "Positive" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                        {c.sentiment}
                      </div>
                    </div>
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