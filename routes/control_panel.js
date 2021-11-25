const express = require('express');
const db = require('../controllers/dbConnetcors');
const modRouter = express.Router();

modRouter.get('/',checkAuthenticated,checkMod,(req,res)=>{
    res.render('control-panel/dashboard.ejs',{user:req.user});
});

modRouter.get('/redeem-requests',checkAuthenticated,checkMod,(req,res)=>{
    res.render('control-panel/redeem-requests.ejs',{user:req.user});
});

modRouter.get('/reported-reviews',checkAuthenticated,checkMod,(req,res)=>{
    db.query("select count(reports.review_id) as total_reports,reports.review_id from reports GROUP BY reports.review_id",(err,reports)=>{
        if(err){
            return res.send(err);
        }
        else{
            let reportArray = new Array();
            for(let i=0;i<reports.length;i++){
                let report={
                    review_id:reports[i].review_id,
                    total_reports:reports[i].total_reports
                }
                reportArray.push(report);
            }
            res.render('control-panel/reported-reviews.ejs',{user:req.user,reports:reportArray});
        }
    });
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