const mongoose = require('mongoose');
const slugify = require('slugify');

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required']
  },
  tags: {
    type: [String], // Array of strings for flexible categorization
    default: []
  },
  published: {
    type: Boolean,
    default: false // Default to draft mode
  }
}, { timestamps: true });

// Index for full-text search on title and content
blogPostSchema.index({ title: 'text', content: 'text' });

// Pre-save hook to generate slug
blogPostSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = BlogPost;