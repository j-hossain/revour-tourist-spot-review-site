const express = require('express');
const modRouter = express.Router();

modRouter.get('/',checkAuthenticated,checkMod,(req,res)=>{
    res.render('control-panel/dashboard.ejs',{user:req.user});
});

modRouter.get('/redeem-requests',checkAuthenticated,checkMod,(req,res)=>{
    res.render('control-panel/redeem-requests.ejs',{user:req.user});
});

modRouter.get('/reported-reviews',checkAuthenticated,checkMod,(req,res)=>{
    res.render('control-panel/reported-reviews.ejs',{user:req.user});
});

function checkMod(req,res,next){
    if(req.user.role=="mod" || req.user.role=="mod")
        return next();
    else{
        return res.redirect('/');
    }
}

function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        return res.redirect('/auth/signin');
    }
}


module.exports = modRouter;