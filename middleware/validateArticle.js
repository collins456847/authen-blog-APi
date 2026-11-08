const Joi = require('joi');

const articleSchema = Joi.object({
    title: Joi.string().trim().min(3).required(),
    content: Joi.string().trim().min(10).required(),
    category: Joi.string().trim().required(),
    tags: Joi.array().items(Joi.string().trim()).default([])
});

const validateArticle = (req, res, next) => {
    const { error, value } = articleSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
    });

    if (error) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: error.details.map(item => item.message)
        });
    }
    req.body = value;
    next();
};

module.exports = validateArticle;
