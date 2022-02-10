var createError = require('http-errors');
var express = require('express');
var env = require('dotenv');
env.config({path: './'});
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');
var passport = require('passport');
var authenticate = require('./authenticate');

var articleRouter = require('./routes/articleRouter');
//const uploadRouter = require('./routes/uploadRouter');
//const favoriteRouter = require('./routes/favoriteRouter');

const mongoose = require('mongoose');

const Articles = require('./models/articles');
//const Favorites = require('./models/favorite');

const url = process.env.MONGODB_URI;
console.log(process.env.MONGODB_URI);
const connect = mongoose.connect(url,{ useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true, });

connect.then((db) => {
  console.log("Connected correctly to server");
}, (err) => { console.log(err); });

var app = express();

// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use("/uploads", express.static('uploads'));

app.get('/', async (req, res) => {
  const articles = await Articles.find().sort({ createdAt: 'desc' })
  res.render('user/homepage', {articles:articles})
});

app.get('/index', async(req,res)=>{
  const articles = await Articles.find().sort({createdAt:'desc'})
  res.render('admin/index',{articles:articles})
});

app.use('/admin', articleRouter);
app.use('/user', articleRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

module.exports = app;
app.listen(5000, () => {
  console.log("Server started");
});
