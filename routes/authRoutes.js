const express = require('express');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();

const signupSchema = Joi.object({
    name: Joi.string().trim().min(2).required(),
    email: Joi.string().trim().email().required(),
    password: Joi.string().min(8).required()
});

const loginSchema = Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().required()
});

const createToken = (user) => jwt.sign(
    { userId: user._id.toString(), name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
);

router.post('/signup', async (req, res) => {
    try {
        const { error, value } = signupSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const email = value.email.toLowerCase();
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(409).json({ message: 'An account with this email already exists' });

        const user = await User.create({ name: value.name, email, password: value.password });
        const token = createToken(user);

        return res.status(201).json({
            message: 'Account created successfully',
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (error) {
        if (error.code === 11000) return res.status(409).json({ message: 'Email is already registered' });
        return res.status(500).json({ message: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { error, value } = loginSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const user = await User.findOne({ email: value.email.toLowerCase() }).select('+password');
        if (!user || !(await user.comparePassword(value.password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = createToken(user);
        return res.status(200).json({
            message: 'Login successful',
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

module.exports = router;
