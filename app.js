const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
//const { title } = require('process');
const bodyParser = require('body-parser');
//const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');



// MongoDB connection string
const mongoURI = (config.database); 

// Connect to MongoDB without deprecated options
mongoose.connect(mongoURI)
    .then(() => {
        console.log('MongoDB connected successfully!');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

   // Get the Mongoose connection object

const db = mongoose.connection;

// Handle connection events
// db.on('error', console.error.bind(console, 'Connection error:'));
// db.once('open', () => {
//     console.log('Connected to the database successfully!');
// });
// init App
const app = express();
const port = 3000

// Bring in Models
let Article = require('./models/article');
const { title } = require('process');

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// // Built-in body parser middleware in Express
// // Parse application/x-www-form-urlencoded
// app.use(express.urlencoded({ extended: true }));

// // Parse application/json
// app.use(express.json());


// Body parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));


// Express Session Middleware
app.use(session( {
    secret: 'keyboard cat', 
    resave: true,
    saveUninitialized: true
}));
app.use(flash());


// Express messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// // Express Validator Middleware
// app.use(expressValidator({
//     errorFormatter: function(param, msg, value) {
//         const namespace = param.split('.');
//         let root = namespace.shift();
//         let formParam = root;

//         while (namespace.length) {
//             formParam += '[' + namespace.shift() + ']';
//         }
//         return {
//             param: formParam,
//             msg: msg,
//             value: value,
//         };
//     }
// }));




// // Express Validator Middleware
// app.use(expressValidator({
//     errorFormatted: function(param, msg, value) {
//         var namespace = param.spilt('.')
//         , root  = namespace.shift()
//         , formParam = root;

//       while(namespace.length) {
//         formParam += '[' + namespace.shift() + ']';
//       }
//       return {
//         param : formParam,
//         msg : msg,
//         value : value
//       };  
//     }
// }));

// Passport Config
require('./config/passport')(passport);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next) {
    res.locals.user = req.user || null;
    next();
});

//Home Route
app.get('/', async (req, res) => {
    try {
        const articles = await Article.find({});
        res.render('index', {
            title: 'Articles',
            articles: articles
        });
    } catch (err) {
        console.log(err);
        res.status(500).send('An error occurred while fetching articles.');
    }
});

// Route files
const articles = require('./routes/article');
const users = require('./routes/users');
app.use('/article', articles);
app.use('/users', users);

// // Add Route
// app.get('/articles/add', (req, res) => {
//     res.render('add_article', {
//         title: 'Add Article'
//     });
//   });

//  // Add Submit Post Route
//  const { body, validationResult } = require('express-validator'); // Import validation functions

//  app.post('/articles/add', [
//      body('title').notEmpty().withMessage('Title is required'),
//      body('author').notEmpty().withMessage('Author is required'),
//      body('body').notEmpty().withMessage('Body is required')
//  ], async (req, res) => {
//      const errors = validationResult(req);
//      if (!errors.isEmpty()) {
//          // Re-render the form with error messages
//          return res.render('add_article', {
//              title: 'Add Article',
//              errors: errors.array(),
//              article: req.body
//          });
//      }
//              // Create a new article instance
//      const article = new Article({
//          title: req.body.title,
//          author: req.body.author,
//          body: req.body.body
//      });
 
//      try {
//          await article.save();
//          req.flash('success', 'Article added');
//          res.redirect('/');
//      } catch (err) {
//          console.error('Error saving article:', err);
//          res.status(500).send('Failed to save the article');
//      }
//  });
 
// // Get Single Article
// app.get('/articles/:id', async (req, res) => {
//     try {
//         const article = await Article.findById(req.params.id);
//         console.log(article);
//         res.render('article', { article }); // Render the article view with the found article data
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Error retrieving article.");
//     }
// });




//app.get('/', (req, res) => {
   // Article.find({}, function(err, articles) {
        // if (err) {
        //     console.log(err);
        // } else {
            // res.render('index', {
            //     title: 'Articles',
            //     articles: articles
            // });
       // }
    //});
//}); 
    // let articles = [
    //     {
    //         id:1,
    //         title:'article one',
    //         author:'Brad Traversy',
    //         body:'This is article one'
    //     },
    //     {
    //         id:2,
    //         title:'article two',
    //         author:'John Doe',
    //         body:'This is article two'
    //     },
    //     {
    //         id:3,
    //         title:'article three',
    //         author:'Brad Traversy',
    //         body:'This is article three'
    //     },
    // ];

// // Load Edit Form

// app.get('/article/edit/:id', async (req, res) => {
//     const { id } = req.params;

//     // Check if the ID is a valid ObjectId
//     if (!mongoose.isValidObjectId(id)) {
//         return res.status(400).send("Invalid Article ID");
//     }

//     try {
//         const article = await Article.findById(id);
//         if (!article) {
//             return res.status(404).send("Article not found");
//         }
//         res.render('edit_article', { article });
//     } catch (err) {
//         console.error("Error retrieving article:", err);
//         res.status(500).send("Error retrieving article");
//     }
// });

// // Load Edit Form
// app.get('/article/edit/:id', async (req, res) => {
//     try {
//         console.log (req.params.id);
//         const article = await Article.findById(req.params.id);
//         if (!article) return res.status(404).send("Article not found");
//         res.render('edit_article', { article });
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Server Error");
//     }
// });

// // Update Submit Post Route
// app.post('/articles/edit/:id', async (req, res) => {
//     const updatedData = {
//         title: req.body.title,
//         author: req.body.author,
//         body: req.body.body
//     };

//     try {
//         await Article.findByIdAndUpdate(req.params.id, updatedData, { new: true });
//         res.redirect('/');
//     } catch (err) {
//         console.log(err);
//         res.status(500).send('Failed to update the article');
//     }
// });



// // Update Submit Post Route
// app.post("/articles/edit/:id", async (req, res) => {
//     const { title, author, body } = req.body; // Assume 'body' is the correct field name
//     const updatedArticle = { title, author, body };

//     try {
//         const result = await Article.findByIdAndUpdate(req.params.id, updatedArticle, { new: true });
        
//         if (!result) {
//             return res.status(404).send("Article not found");
//         }

//         req.flash('success', 'Article Updated');
//         res.redirect("/"); // Redirect to home page
//     } catch (error) {
//         console.error("Error updating article:", error);
//         res.status(500).send("Failed to update the article");
//     }
// });

// // Delete Article
// app.delete('/article/:id', async (req, res) => {
//     try {
//         await Article.findByIdAndDelete(req.params.id);
//         res.sendStatus(200);
//     } catch (err) {
//         console.log(err);
//         res.status(500).send('Failed to delete the article');
//     }
// });



 // start server
 app.listen(port, () => {
    console.log(`Server started on port ${port}`)
  });


 // module.exports = db;
 