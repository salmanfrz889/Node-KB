const express = require('express');
const router = express.Router();

// Article model
const Article = require('../models/article');
const { body, validationResult } = require('express-validator'); // Import validation functions

// User Model
const User = require('../models/user');

// Add Route
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('add_article', {
        title: 'Add Article'
    });
});

// Add Submit Post Route
router.post('/add', [
    body('title').notEmpty().withMessage('Title is required'),
    //body('author').notEmpty().withMessage('Author is required'),
    body('body').notEmpty().withMessage('Body is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('add_article', {
            title: 'Add Article',
            errors: errors.array(),
            article: req.body
        });
    }

    const article = new Article({
        title: req.body.title,
        author: req.user._id,
        body: req.body.body
    });

    try {
        await article.save();
        req.flash('success', 'Article added');
        res.redirect('/');
    } catch (err) {
        console.error('Error saving article:', err);
        res.status(500).send('Failed to save the article');
    }
});



// Load Edit Form
router.get('/edit/:id', ensureAuthenticated, async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) { 
            return res.status(404).send("Article not found");
        }
      // Authorization check
        if(article.author != req.user.id) {
            req.flash('danger', 'Not Authorized');
            return res.redirect('/');
        }
        res.render('edit_article', { article });
        
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

// Update Submit Post Route
router.post('/edit/:id', async (req, res) => {
    const { title, author, body } = req.body;
    const updatedArticle = { title, author, body };

    try {
        const result = await Article.findByIdAndUpdate(req.params.id, updatedArticle, { new: true });
        
        if (!result) {
            return res.status(404).send("Article not found");
        }

        req.flash('success', 'Article Updated');
        res.redirect("/");
    } catch (error) {
        console.error("Error updating article:", error);
        res.status(500).send("Failed to update the article");
    }
});

/// Delete Article
router.delete('/:id', ensureAuthenticated, async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) {
            return res.status(404).send('Article not found');
        }

        // Authorization check
        if (article.author.toString() !== req.user._id.toString()) {
            return res.status(403).send('Not authorized to delete this article');
        }

        await Article.findByIdAndDelete(req.params.id);
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to delete the article');
    }
});


// // Get Single Article
// router.get('/:id', async (req, res) => {
//     try {
//         const article = await Article.findById(req.params.id);
//         User.findById(article.author, function(err, user) {
//             res.render('article', { article });
//         })
        
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Error retrieving article.");
//     }
// });

// Get Single Article
router.get('/:id', async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        
        if (!article) {
            return res.status(404).send("Article not found.");
        }

        const user = await User.findById(article.author); // Fetch the author's details

        res.render('article', { 
            article, 
            author: user ? user.name : 'Unknown' // Pass author details to the view
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Error retrieving article.");
    }
});

// Access Control
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
       req.flash('danger', 'please login');
       res.redirect('/users/login'); 
    }
}

module.exports = router;
