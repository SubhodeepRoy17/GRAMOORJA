"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Heart, MessageCircle } from "lucide-react"

export function CommentsSection() {
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState("")
  const [name, setName] = useState("")
  const [rating, setRating] = useState(5)
  const [liked, setLiked] = useState<number[]>([])

  useEffect(() => {
    const stored = localStorage.getItem("comments")
    if (stored) {
      setComments(JSON.parse(stored))
    }
  }, [])

  const handleAddComment = () => {
    if (newComment.trim() && name.trim()) {
      const comment = {
        id: Date.now(),
        name,
        text: newComment,
        rating,
        timestamp: new Date().toLocaleDateString(),
        likes: 0,
      }
      const updated = [comment, ...comments]
      setComments(updated)
      localStorage.setItem("comments", JSON.stringify(updated))
      setNewComment("")
      setName("")
      setRating(5)
    }
  }

  const toggleLike = (id: number) => {
    if (liked.includes(id)) {
      setLiked(liked.filter((i) => i !== id))
    } else {
      setLiked([...liked, id])
    }
  }

  return (
    <section className="w-full py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-secondary/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">Share Your Thoughts</h2>
          <p className="text-lg text-muted-foreground">Help us improve by sharing your feedback</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Comment Form */}
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
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className={`text-2xl transition ${star <= rating ? "text-primary" : "text-muted"}`}
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
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground resize-none h-24"
                  />
                </div>

                <Button
                  onClick={handleAddComment}
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                  disabled={!newComment.trim() || !name.trim()}
                >
                  Post Comment
                </Button>
              </div>
            </Card>
          </div>

          {/* Comments List */}
          <div className="lg:col-span-2 space-y-4">
            {comments.length === 0 ? (
              <Card className="p-12 text-center">
                <MessageCircle className="w-12 h-12 text-muted mx-auto mb-4" />
                <p className="text-muted-foreground">No comments yet. Be the first to share!</p>
              </Card>
            ) : (
              comments.map((comment) => (
                <Card key={comment.id} className="p-6 hover:shadow-lg transition-shadow border border-border/50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-foreground">{comment.name}</h4>
                      <p className="text-xs text-muted-foreground">{comment.timestamp}</p>
                    </div>
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

                  <p className="text-muted-foreground leading-relaxed mb-4">{comment.text}</p>

                  <button
                    onClick={() => toggleLike(comment.id)}
                    className={`flex items-center gap-2 text-sm transition ${
                      liked.includes(comment.id) ? "text-primary" : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${liked.includes(comment.id) ? "fill-current" : ""}`} />
                    <span>Helpful</span>
                  </button>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
