const mongoose = require('mongoose');

// Define the Article schema
const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
});

// Create a model from the schema
const Article = mongoose.model('Article', articleSchema);

// Export the model
module.exports = Article;
