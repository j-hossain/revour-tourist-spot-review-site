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
var MySQLStore = require('express-mysql-session')(session);

const methodOverride = require('method-override');


const db = require('./controllers/dbConnetcors');
var sessionStore = new MySQLStore({
    checkExpirationInterval: 900000,// How frequently expired sessions will be cleared; milliseconds.
    expiration: 86400000,// The maximum age of a valid session; milliseconds.
    createDatabaseTable: true,// Whether or not to create the sessions database table, if one does not already exist.
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
}, db);

app.set('view engine','ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(flash());
app.use(session({
    secret:process.env.SESSION_SECRET,
    store: sessionStore,
    resave: true,
    saveUninitialized: true
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
const reviewRouter = require('./routes/review');
app.use('/review',reviewRouter);

app.get('/', async (req,res)=>{
    res.render('home/',{user:req.user});
});
app.get('/search', async (req,res)=>{
    res.render('search/');
});


app.listen(3000);