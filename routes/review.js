const express = require('express');
const reviewRouter = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../controllers/dbConnetcors');
const passport = require('passport');
const slugify = require('slugify');

reviewRouter.get('/write',checkAuthenticated,(req,res)=>{
    res.render('review/write');
});

function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        return res.redirect('/auth/signin');
    }
}
 
module.exports = reviewRouter;