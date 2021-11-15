const express = require('express');
const User = require('../models/user');
const profileRouter = express.Router();

profileRouter.get('/about', checkAuthenticated, (req,res)=>{
    res.render('profile/about',{user:req.user});
});

profileRouter.get('/update/:id', checkAuthenticated, async (req,res)=>{
    res.render('profile/update',{user:req.user});
});

profileRouter.post('/update',checkAuthenticated, async (req,res)=>{
    
    return res.send("ok");
});

function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        return res.redirect('/auth/signin');
    }
}


module.exports = profileRouter;