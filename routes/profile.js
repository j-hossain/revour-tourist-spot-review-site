const express = require('express');
const profileRouter = express.Router();

profileRouter.get('/about', checkAuthenticated, (req,res)=>{
    res.render('profile/about',{user:req.user});
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