const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const jwt = require('jsonwebtoken');

// Rate Limiting Middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes',
});

// Logger Middleware
const logger = (req, res, next) => {
    console.log(`${req.method} ${req.originalUrl} at ${new Date().toISOString()}`);
    next();
};

// Middleware to parse JSON and URL-encoded bodies
const parseRequestData = [
    express.json(),
    express.urlencoded({ extended: true }),
];

// CORS Middleware
const handleCORS = cors({
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
});

// Security Middleware
const securityMiddleware = [
    helmet(),
    mongoSanitize(), // Prevent NoSQL injection
    xss(), // Prevent XSS attacks
];

// Authentication Middleware (JWT Verification)
const checkAuthHeader = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized access, token required' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user data to request
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
};

// 404 Handler Middleware
const handle404 = (req, res) => {
    res.status(404).json({
        error: 'Route Not Found',
        message: `The requested URL ${req.originalUrl} was not found on this server`,
    });
};

// Export all middleware
module.exports = {
    limiter,
    logger,
    parseRequestData,
    handleCORS,
    securityMiddleware,
    checkAuthHeader,
    handle404,
};