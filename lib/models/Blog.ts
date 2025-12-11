import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
  },
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    trim: true,
    maxlength: [1000, 'Comment cannot exceed 1000 characters'],
  },
  approved: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters'],
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be a valid URL slug'],
  },
  excerpt: {
    type: String,
    required: [true, 'Excerpt is required'],
    trim: true,
    minlength: [50, 'Excerpt must be at least 50 characters'],
    maxlength: [300, 'Excerpt cannot exceed 300 characters'],
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    minlength: [100, 'Content must be at least 100 characters'],
  },
  image: {
    type: String,
    default: '/blog-placeholder.jpg',
    validate: {
      validator: function(v: string) {
        return /^\/.*\.(jpg|jpeg|png|gif|webp)$/i.test(v) || /^https?:\/\/.*\.(jpg|jpeg|png|gif|webp)$/i.test(v);
      },
      message: 'Please provide a valid image URL'
    }
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    default: 'Ghoroa Delights Team',
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['Craftsmanship', 'Health & Wellness', 'Seasonal Offers', 'Science', 'Sustainability', 'Stories', 'Recipe', 'Festival', 'News'],
      message: '{VALUE} is not a valid category'
    },
    default: 'Stories',
  },
  readTime: {
    type: String,
    default: '5 min read',
    trim: true,
  },
  tags: {
    type: [String],
    default: [],
    validate: {
      validator: function(v: string[]) {
        return v.length <= 10;
      },
      message: 'Cannot have more than 10 tags'
    }
  },
  featured: {
    type: Boolean,
    default: false,
  },
  published: {
    type: Boolean,
    default: true,
  },
  views: {
    type: Number,
    default: 0,
    min: 0,
  },
  likes: {
    type: Number,
    default: 0,
    min: 0,
  },
  shares: {
    type: Number,
    default: 0,
    min: 0,
  },
  comments: [CommentSchema],
  metaTitle: {
    type: String,
    trim: true,
    maxlength: [60, 'Meta title cannot exceed 60 characters'],
  },
  metaDescription: {
    type: String,
    trim: true,
    maxlength: [160, 'Meta description cannot exceed 160 characters'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  publishedAt: {
    type: Date,
    default: Date.now,
  },
  seoKeywords: {
    type: [String],
    default: [],
  },
  relatedPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
  }],
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for comment count
BlogSchema.virtual('commentCount').get(function() {
  return this.comments ? this.comments.length : 0;
});

// Virtual for approved comment count
BlogSchema.virtual('approvedCommentCount').get(function() {
  return this.comments ? this.comments.filter((comment: any) => comment.approved).length : 0;
});

// Indexes for better query performance
BlogSchema.index({ slug: 1 });
BlogSchema.index({ category: 1 });
BlogSchema.index({ featured: 1 });
BlogSchema.index({ published: 1 });
BlogSchema.index({ createdAt: -1 });
BlogSchema.index({ views: -1 });
BlogSchema.index({ 'tags': 1 });
BlogSchema.index({ title: 'text', excerpt: 'text', content: 'text' });

// Pre-save middleware to update timestamps
BlogSchema.pre('save', function(next) {
  if (this.isModified('published') && this.published && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  this.updatedAt = new Date();
  next();
});

// Pre-save middleware to generate meta fields if not provided
BlogSchema.pre('save', function(next) {
  if (!this.metaTitle) {
    this.metaTitle = this.title.substring(0, 60);
  }
  
  if (!this.metaDescription) {
    this.metaDescription = this.excerpt.substring(0, 160);
  }
  
  next();
});

// Pre-save middleware to generate read time if not provided
BlogSchema.pre('save', function(next) {
  if (!this.readTime || this.isModified('content')) {
    const wordCount = this.content.split(' ').length;
    const minutes = Math.ceil(wordCount / 200); // Average reading speed: 200 words per minute
    this.readTime = `${minutes} min read`;
  }
  next();
});

// Static method to find published posts
BlogSchema.statics.findPublished = function() {
  return this.find({ published: true }).sort({ createdAt: -1 });
};

// Static method to find featured posts
BlogSchema.statics.findFeatured = function() {
  return this.find({ published: true, featured: true }).sort({ createdAt: -1 });
};

// Static method to find posts by category
BlogSchema.statics.findByCategory = function(category: string) {
  return this.find({ published: true, category }).sort({ createdAt: -1 });
};

// Static method to find posts by tag
BlogSchema.statics.findByTag = function(tag: string) {
  return this.find({ published: true, tags: tag }).sort({ createdAt: -1 });
};

// Static method to search posts
BlogSchema.statics.search = function(query: string) {
  return this.find({
    published: true,
    $text: { $search: query }
  }, {
    score: { $meta: 'textScore' }
  }).sort({ score: { $meta: 'textScore' } });
};

// Static method to get popular posts
BlogSchema.statics.getPopular = function(limit = 5) {
  return this.find({ published: true })
    .sort({ views: -1, likes: -1 })
    .limit(limit);
};

// Static method to get recent posts
BlogSchema.statics.getRecent = function(limit = 5) {
  return this.find({ published: true })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Instance method to increment views
BlogSchema.methods.incrementViews = async function() {
  this.views += 1;
  return this.save();
};

// Instance method to increment likes
BlogSchema.methods.incrementLikes = async function() {
  this.likes += 1;
  return this.save();
};

// Instance method to increment shares
BlogSchema.methods.incrementShares = async function() {
  this.shares += 1;
  return this.save();
};

// Instance method to add comment
BlogSchema.methods.addComment = async function(commentData: {
  name: string;
  email: string;
  content: string;
}) {
  this.comments.push(commentData);
  return this.save();
};

// Instance method to get approved comments
BlogSchema.methods.getApprovedComments = function() {
  return this.comments.filter((comment: any) => comment.approved);
};

// Instance method to toggle published status
BlogSchema.methods.togglePublished = async function() {
  this.published = !this.published;
  if (this.published && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  return this.save();
};

// Instance method to toggle featured status
BlogSchema.methods.toggleFeatured = async function() {
  this.featured = !this.featured;
  return this.save();
};

// Method to get related posts (based on tags)
BlogSchema.methods.getRelatedPosts = async function(limit = 3) {
  if (this.tags.length === 0) {
    return [];
  }
  
  const Blog = mongoose.model('Blog');
  return Blog.find({
    _id: { $ne: this._id },
    published: true,
    tags: { $in: this.tags }
  })
  .sort({ createdAt: -1 })
  .limit(limit);
};

// Method to generate URL
BlogSchema.methods.getUrl = function() {
  return `/blog/${this.slug}`;
};

// Method to generate social share URLs
BlogSchema.methods.getShareUrls = function() {
  const url = encodeURIComponent(`https://ghoroa-delights.com/blog/${this.slug}`);
  const title = encodeURIComponent(this.title);
  
  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    whatsapp: `https://wa.me/?text=${title}%20${url}`,
  };
};

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema);