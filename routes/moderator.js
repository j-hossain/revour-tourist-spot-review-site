const express = require('express');
const modRouter = express.Router();

modRouter.get('/',(req,res)=>{
    if(req.user.role=="mod")
        res.render('mod/dashboard',{user:req.user});
    else{
        res.redirect('/');
    }
});

module.exports = modRouter;