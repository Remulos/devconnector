// express info at https://expressjs.com/en/4x/api.html
const express = require('express');
// mongoose info at https://mongoosejs.com/docs/guide.html
const mongoose = require('mongoose');
// body-parser info at https://www.npmjs.com/package/body-parser
const bodyParser = require('body-parser');
// passport info at https://www.npmjs.com/package/passport
const passport = require('passport');

// importing routes
const users = require('./routes/api/users');
const profiles = require('./routes/api/profiles');
const posts = require('./routes/api/posts');

// Create new express app
const app = express();

// Body Parser middleware
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// Parse application/json
app.use(bodyParser.json());

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB (at mLab) using mongoose
mongoose
	.connect(db, { useNewUrlParser: true })
	.then(() => console.log('MongoDB Connected'))
	.catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);

// Use Routes
//app.use requires middleware function in route file
app.use('/users', users);
app.use('/profile', profiles);
app.use('/posts', posts);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
