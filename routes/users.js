
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const passport = require('passport');



// Bring in User model
const User = require('../models/user');

// Register Form
router.get('/register', (req, res) => {
    res.render('register');
});

// Register Process
router.post(
    '/register',
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('username').notEmpty().withMessage('Username is required'),
        body('password').notEmpty().withMessage('Password is required'),
        body('password2')
            .custom((value, { req }) => value === req.body.password)
            .withMessage('Passwords do not match')
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.render('register', {
                errors: errors.array(),
                user: req.body // Keeps the form populated with submitted data
            });
        }

        const { name, email, username, password } = req.body;

        try {
            // Hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create a new user
            const newUser = new User({
                name,
                email,
                username,
                password: hashedPassword
            });

            await newUser.save();

            req.flash('success', 'You are now registered and can log in');
            res.redirect('/users/login');
        } catch (err) {
            console.error('Error saving user:', err);
            res.status(500).send('Server error');
        }
    }
);

// Login Form
router.get('/login', (req, res) => {
    res.render('login');
});

// Login Process
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true,
    })(req, res, next);
});

// Logout 
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
    req.flash('success', 'You are logged out');
    res.redirect('/users/login');
    });
});

module.exports = router;
