const express = require('express');
const mongoose = require('mongoose');
const Article = require('../models/article');
const validateArticle = require('../middleware/validateArticle');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// Every article route, including reading and searching, requires a valid token.
router.use(requireAuth);

router.get('/', async (req, res) => {
    try {
        const articles = await Article.find().populate('userId', 'name email');
        res.status(200).json({ message: 'Articles retrieved successfully', count: articles.length, articles });
    } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/search', async (req, res) => {
    try {
        const keyword = req.query.q;
        if (!keyword || !keyword.trim()) return res.status(400).json({ message: 'Please provide a search keyword' });
        const articles = await Article.find({ $text: { $search: keyword } }).populate('userId', 'name email');
        res.status(200).json({ count: articles.length, articles });
    } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid article ID' });
        const article = await Article.findById(req.params.id).populate('userId', 'name email');
        if (!article) return res.status(404).json({ message: 'Article not found' });
        res.status(200).json(article);
    } catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/', validateArticle, async (req, res) => {
    try {
        const article = await Article.create({
            ...req.body,
            author: req.user.name,
            userId: req.user.userId
        });
        res.status(201).json({ message: 'Article created successfully', article });
    } catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/:id', validateArticle, async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid article ID' });
        const article = await Article.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.userId },
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!article) {
            const exists = await Article.exists({ _id: req.params.id });
            return res.status(exists ? 403 : 404).json({ message: exists ? 'You can only edit your own articles' : 'Article not found' });
        }
        res.status(200).json({ message: 'Article updated successfully', article });
    } catch (error) { res.status(500).json({ message: error.message }); }
});

router.delete('/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid article ID' });
        const article = await Article.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
        if (!article) {
            const exists = await Article.exists({ _id: req.params.id });
            return res.status(exists ? 403 : 404).json({ message: exists ? 'You can only delete your own articles' : 'Article not found' });
        }
        res.status(200).json({ message: 'Article deleted successfully' });
    } catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;
