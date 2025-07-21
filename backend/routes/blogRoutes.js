const express = require('express');
const router = express.Router();
const BlogPost = require('../models/BlogPost');
const authenticate = require('../controllers/middleware/authMiddleware');
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');

// ✅ GET all blog posts
router.get('/', async (req, res) => {
    try {
      console.log('Fetching blog posts...');
      const blogPosts = await BlogPost.find()
        .populate('author', 'username email')
        .select('title content author createdAt');
      console.log('Blog posts fetched:', blogPosts.length);
  
      if (!blogPosts.length) {
        return res.status(404).json({ message: 'No blog posts found' });
      }
  
      res.status(200).json(blogPosts);
    } catch (error) {
      console.error('Error fetching blog posts:', error.message, error.stack);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

// ✅ GET a single blog post by ID
router.get('/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid blog post ID format' });
        }

        const blogPost = await BlogPost.findById(req.params.id)
            .populate('author', 'username email')
            .select('-__v'); // Exclude unnecessary fields

        if (!blogPost) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        res.status(200).json(blogPost);
    } catch (error) {
        console.error('Error fetching blog post:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// ✅ POST - Create a new blog post (Authenticated users only)
router.post(
    '/',
    authenticate,
    [
        check('title', 'Title is required').notEmpty(),
        check('content', 'Content must be at least 10 characters').isLength({ min: 10 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const newBlogPost = new BlogPost({
                title: req.body.title,
                content: req.body.content,
                author: req.user.id
            });

            const blogPost = await newBlogPost.save();
            res.status(201).json(blogPost);
        } catch (error) {
            console.error('Error creating blog post:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
);

// ✅ PUT - Update a blog post (Only the owner can update)
router.put(
    '/:id',
    authenticate,
    [
        check('title', 'Title cannot be empty').optional().notEmpty(),
        check('content', 'Content must be at least 10 characters').optional().isLength({ min: 10 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({ message: 'Invalid blog post ID format' });
            }

            const blogPost = await BlogPost.findById(req.params.id);

            if (!blogPost) {
                return res.status(404).json({ message: 'Blog post not found' });
            }

            if (blogPost.author.toString() !== req.user.id) {
                return res.status(403).json({ message: 'You are not authorized to update this blog post' });
            }

            const updatedBlogPost = await BlogPost.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );

            res.status(200).json(updatedBlogPost);
        } catch (error) {
            console.error('Error updating blog post:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
);

// ✅ DELETE - Delete a blog post (Only the owner can delete, using transactions)
router.delete('/:id', authenticate, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid blog post ID format' });
        }

        const blogPost = await BlogPost.findById(req.params.id).session(session);

        if (!blogPost) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        if (!blogPost.author || blogPost.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to delete this blog post' });
        }

        await blogPost.deleteOne({ session });

        // Future-proofing: Add logic to delete associated comments, likes, etc.
        // await Comment.deleteMany({ blogPost: req.params.id }).session(session);

        await session.commitTransaction();
        session.endSession();

        res.json({ message: 'Blog post deleted successfully' });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error deleting blog post:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;