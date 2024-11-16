// const LocalStrategy = require('passport-local').Strategy;
// const User = require('../models/user');
// const config = require('../config/database');
// const bcrypt = require('bcrypt.js');


// module.exports = function (passport) {
//     // Local Strategy
//     passport.use(new LocalStrategy({ usernameField: 'username' }, async (username, password, done) => {
//         try {
//             // Match Username
//             const user = await User.findOne({ username });
//             if (!user) {
//                 return done(null, false, { message: 'No user found with that username.'});
//             }
        
//             // Match Password
//             const isMatch = await bcrypt.compare(password, user.password);
//             if (!isMatch) {
//                 return done(null, false, { message: 'Wrong Password.' });
//             }

//             return done(null, user);
        
//             } catch (err) {
//                 return done(err);
//             }
//         })
//     );

//     passport.serializerUser((user, done) =>  done (null, user.id));
        
//     passport.deserializerUser(async (id, done) =>  {
//         try {
//             const user = await User.findById(id);
//             done(null, user);
//         } catch (err) {
//             done(err, null);     
//         }
        
        
//     });

// };

// const LocalStrategy = require('passport-local').Strategy;
// const User = require('../models/user');
// const config = require('../config/database');
// const bcrypt = require('bcryptjs'); // Correct import

// module.exports = function (passport) {
//     // Local Strategy
//     passport.use(
//         new LocalStrategy({ usernameField: 'username' }, async (username, password, done) => {
//             try {
//                 // Match Username
//                 const user = await User.findOne({ username });
//                 if (!user) {
//                     return done(null, false, { message: 'No user found with that username.' });
//                 }

//                 // Match Password
//                 const isMatch = await bcrypt.compare(password, user.password);
//                 if (!isMatch) {
//                     return done(null, false, { message: 'Wrong Password.' });
//                 }

//                 return done(null, user);
//             } catch (err) {
//                 return done(err);
//             }
//         })
//     );

//     // Correct method names for serialize and deserialize
//     passport.serializeUser((user, done) => done(null, user.id));

//     passport.deserializeUser(async (id, done) => {
//         try {
//             const user = await User.findById(id);
//             done(null, user);
//         } catch (err) {
//             done(err, null);
//         }
//     });
// };



const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const config = require('../config/database');
const bcrypt = require('bcryptjs'); // Correct import

module.exports = function (passport) {
    // Local Strategy
    passport.use(
        new LocalStrategy({ usernameField: 'username' }, async (username, password, done) => {
            try {
                // Match Username
                const user = await User.findOne({ username });
                if (!user) {
                    return done(null, false, { message: 'No user found with that username.' });
                }

                // Match Password
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return done(null, false, { message: 'Wrong Password.' });
                }

                return done(null, user);
            } catch (err) {
                return done(err);
            }
        })
    );

    // Serialize User
    passport.serializeUser((user, done) => done(null, user.id));

    // Deserialize User
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
};
