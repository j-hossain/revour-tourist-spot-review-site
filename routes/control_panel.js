const express = require('express');
const db = require('../controllers/dbConnetcors');
const user = require('../models/user');
const modRouter = express.Router();

modRouter.get('/',checkAuthenticated,checkMod,(req,res)=>{
    res.render('control-panel/dashboard.ejs',{user:req.user});
});

modRouter.get('/redeem-requests',checkAuthenticated,checkMod,(req,res)=>{
    res.render('control-panel/redeem-requests.ejs',{user:req.user});
});

modRouter.get('/moderators',checkAuthenticated,checkAdmin,(req,res)=>{
    db.query("select * from user_main",(err,users)=>{
        if(err){
            return res.send(err);
        }
        else{
            let userArray = new Array();
            for(let i=0;i<users.length;i++){
                let user={
                    id:users[i].id,
                    username:users[i].username,
                    role:users[i].role
                }
                userArray.push(user);
            }
            return res.render('control-panel/manage-users',{user:req.user,alluser:userArray});
        }
    })
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

modRouter.post('/update-role/:user/:role',checkAuthenticated,checkAdmin,(req,res)=>{
    // console.log("hello");
    db.query("update user_main set role=? where id=?",[req.params.role,req.params.user],(err,result)=>{
        if(err){
            console.log(err)
            return res.send(err);
        }
        else{
            return res.send("ok");
        }
    });
});



function checkMod(req,res,next){
    if(req.user.role=="mod" || req.user.role=="admin")
        return next();
    else{
        return res.redirect('/');
    }
}

function checkAdmin(req,res,next){
    if(req.user.role=="admin")
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