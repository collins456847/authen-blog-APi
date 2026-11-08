const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    tags: { type: [String], default: [] },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

articleSchema.index({ title: 'text', content: 'text', author: 'text', category: 'text', tags: 'text' });
module.exports = mongoose.model('Article', articleSchema);
