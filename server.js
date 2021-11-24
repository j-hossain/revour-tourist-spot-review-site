const express = require('express');
const app = express();
const path = require('path');
const fileupload = require('express-fileupload');
const rewardController = require('./controllers/reward');

  
const dotenv = require('dotenv');
dotenv.config({path:"./common.env"})

const passport = require('passport');

const initializePassport = require('./passport-config');
initializePassport(passport);

const flash = require('express-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

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
app.use(fileupload());
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
const controlRouter = require('./routes/control_panel');
app.use('/control-panel',controlRouter);
const reviewRouter = require('./routes/review');
app.use('/review',reviewRouter);
const questionRouter = require('./routes/question');
app.use('/question',questionRouter);


app.get('/', async (req,res)=>{
    res.render('home/',{user:req.user});
});
app.get('/search', async (req,res)=>{
    res.render('search/',{user:req.user});
});
app.post("/upload",checkAuthenticated,(req,res)=>{
    let image = req.files.image;
    if(image){
        imagePath = Date.now() + image.name;
        let uploadPath =__dirname + '/public/uploads/' + imagePath;
        image.mv(uploadPath,(err)=>{
            if(err)
                res.send({status:404,err:err});

            else{
                res.send({status:400,src:imagePath});
            }
        })
    }
});

app.post("/maps/search",(req,res)=>{
    let lgn = req.body.lgn;
    let lat = req.body.lat;
    db.query("select * from locations where lat=? and lgn=?",[lat,lgn],(err,result)=>{
        if(err){
            res.send(err);
            return;
        }
        else{
            if(result.length>0){
                let location = {
                    found: true,
                    id:result[0].id,
                    lat:result[0].lat,
                    lgn:result[0].lgn,
                    category:result[0].category,
                    name:result[0].name
                }
                res.send(location);
                return;
            }
            else{
                res.send({found:false});
            }
        }
    });
});


app.post("/maps/add",checkAuthenticated, async (req,res)=>{
    let category = req.body.category;
    let name = req.body.name;
    let lgn = req.body.lgn;
    let lat = req.body.lat;

    await db.query("insert into locations (lgn,lat,name,category) values(?,?,?,?)",[lgn,lat,name,category],async (err,result)=>{
        if(err){
            res.send({status:false,error:err});
            return;
        }
        else{
            // rewardController.uniqueLocationReward(req.user.id);
            return res.send({status:true,id:result.insertId});
        }
    });
});



function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        return res.redirect('/auth/signin');
    }
}



app.listen(3000);