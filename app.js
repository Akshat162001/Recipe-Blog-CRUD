const express = require('express');
const expressLayouts = require('express-ejs-layouts'); // Fixed syntax error in variable assignment

const app = express();
const port = process.env.PORT || 3000; // Fixed spacing issue in "process.env"
const fileUpload = require('express-fileupload');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');


require('dotenv').config();

app.use(express.urlencoded( { extended: true } ));
app.use(express.static('public'));
app.use(expressLayouts);

app.use(cookieParser('CookingBlogSecure'));
app.use(session({
  secret: 'CookingBlogSecretSession',
  saveUninitialized: true,
  resave: true
}));
app.use(flash());
app.use(fileUpload());


app.set('layout', './layouts/main'); // Setting the layout
app.set('view engine','ejs')
const routes = require('./server/routes/recipeRoutes.js'); // Fixed missing semicolon
app.use('/', routes);

app.listen(port, () => console.log(`Listening to port ${port}`)); // Fixed template string syntax
