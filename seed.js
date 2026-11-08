// Optional seed script for a fresh database. Run with: npm run seed
require('dotenv').config();
const mongoose = require('mongoose');
const Article = require('./models/article');

async function seedArticles() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected. This authenticated API assigns articles to registered users.');
        console.log('Create a user via POST /auth/signup, then create articles via POST /api/articles with its JWT.');
    } catch (error) {
        console.error(error.message);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
}
seedArticles();
