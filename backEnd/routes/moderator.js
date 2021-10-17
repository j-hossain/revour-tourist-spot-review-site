const express = require('express');
const modRouter = express.Router();

modRouter.get('/signin',(req,res)=>{
    res.render('mod/modSignIn');
});
modRouter.get('/',(req,res)=>{
    res.render('mod/dashboard');
});

module.exports = modRouter;