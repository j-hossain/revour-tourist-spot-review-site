const express = require('express');
const app = express();
const path = require('path');

  
const dotenv = require('dotenv');
dotenv.config({path:"./common.env"})

const passport = require('passport');

const initializePassport = require('./passport-config');
initializePassport(passport);

const flash = require('express-flash');
const session = require('express-session');

const methodOverride = require('method-override');


const db = require('./controllers/dbConnetcors');

app.set('view engine','ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(flash());
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(methodOverride('_method'));

app.use(passport.initialize());
app.use(passport.session());


//routers setup
const authRouter = require('./routes/auth');
app.use('/auth',authRouter);
const profileRouter = require('./routes/profile');
app.use('/profile',profileRouter);
const modRouter = require('./routes/moderator');
app.use('/mod',modRouter);

app.get('/', async (req,res)=>{
    res.render('home/',{user:req.user});
});
app.get('/search', async (req,res)=>{
    res.render('search/');
});


app.listen(3000);