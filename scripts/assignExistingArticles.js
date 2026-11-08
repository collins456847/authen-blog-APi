// Assign legacy articles (created before authentication) to an existing user.
// Run: npm run migrate:articles -- your-registered-email@example.com
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user');
const Article = require('../models/article');

async function migrate() {
    const email = process.argv[2];
    if (!email) throw new Error('Please provide the registered email address as an argument.');

    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) throw new Error('No registered user found with that email. Sign up first.');

    const result = await Article.updateMany(
        { $or: [{ userId: { $exists: false } }, { userId: null }] },
        { $set: { userId: user._id, author: user.name } }
    );
    console.log(`Assigned ${result.modifiedCount} existing article(s) to ${user.email}.`);
}

migrate()
    .catch(error => { console.error(error.message); process.exitCode = 1; })
    .finally(async () => { if (mongoose.connection.readyState) await mongoose.disconnect(); });
