require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const articleRoutes = require('./routes/articleRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(express.json());

app.get('/', (req, res) => res.send('Welcome to the authenticated Blog API'));
app.use('/auth', authRoutes);
app.use('/api/articles', articleRoutes);

const PORT = process.env.PORT || 3000;

if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
    console.error('MONGO_URI and JWT_SECRET must be set in the environment.');
    process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected successfully');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((error) => {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    });
