const Joi = require('joi');

// Schema for user registration
const registerSchema = Joi.object({
    username: Joi.string()
        .pattern(/^[a-zA-Z0-9_]+$/)
        .min(3)
        .max(30)
        .required()
        .messages({
            'string.pattern.base': 'Username can only contain letters, numbers, and underscores.',
            'string.min': 'Username must be at least 3 characters long.',
            'string.max': 'Username cannot be more than 30 characters long.'
        }),
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Invalid email format.'
        }),
    password: Joi.string()
        .min(8)
        .max(64)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
        .required()
        .messages({
            'string.min': 'Password must be at least 8 characters long.',
            'string.max': 'Password cannot be more than 64 characters long.',
            'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
        })
});

// Schema for user login
const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Invalid email format.'
        }),
    password: Joi.string()
        .min(8)
        .required()
        .messages({
            'string.min': 'Password must be at least 8 characters long.'
        })
});

// Middleware function for registration validation
const validateRegisterInput = (req, res, next) => {
    const { error } = registerSchema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            errors: error.details.map(detail => detail.message) // Returns all errors
        });
    }
    next();
};

// Middleware function for login validation
const validateLoginInput = (req, res, next) => {
    const { error } = loginSchema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            errors: error.details.map(detail => detail.message) // Returns all errors
        });
    }
    next();
};

module.exports = {
    validateRegisterInput,
    validateLoginInput
};