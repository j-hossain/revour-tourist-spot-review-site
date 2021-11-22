const express = require('express');
const reviewRouter = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../controllers/dbConnetcors');
const passport = require('passport');
const slugify = require('slugify');
const REVIEW = require('../models/review');
const review = require('../models/review');
const user = require('../models/user');

reviewRouter.get('/write',checkAuthenticated,(req,res)=>{
    res.render('review/write-review',{user:req.user});
});

reviewRouter.get('/show/:id',async (req,res)=>{
    await REVIEW.getReview(req.params.id,(err,review)=>{
        if(err)
            return res.send(err);
        else{
            return res.render('review/show',{user:req.user,review:review});
        }
    });
});

reviewRouter.get('/edit/:id',checkAuthenticated,async (req,res)=>{
    
    await REVIEW.getReview(req.params.id,(err,review)=>{
        if(err)
            return res.send(err);
        else{
            if(review.user.id!=req.user.id){
                let url = '/review/show/'+req.params.id;
                return res.redirect(url);
            }
            return res.render('review/edit',{user:req.user,review:review});
        }
    });
});

reviewRouter.post('/insert',checkAuthenticated,(req,res)=>{
    console.log("creating review");
    db.query("insert into review (title,location) values(?,?)",[req.body.title,req.body.location],(err,result)=>{
        if(err){
            res.send({status:false,error:err});
            return;
        }
        else{
            let reviewId = result.insertId;
            db.query("insert into review_posting (review_id,user_id,post_date) values (?,?,?)",[reviewId,req.user.id,Date.now().toLocaleString()],(er,rows)=>{
                if(err){
                    res.send({status:false,error:err});
                    return;
                }
                else{
                    res.send({status:true,id:reviewId});
                    return;
                }
            });
        }
    });
});

reviewRouter.post("/addimages",checkAuthenticated,(req,res)=>{
    console.log("adding images");
    let images = req.body.images.split(",");
    let data = new Array();
    
    images.forEach(image => {
        let row = new Array();
        row.push(image);
        row.push(req.body.reviewId);
        data.push(row);
    });
    db.query("insert into review_images (src,review_id) values ?",[data],(err,result)=>{
        if(err){
            console.log(err);
            return res.send({status:false,error:err});
        }
    });
});

reviewRouter.post("/adddetails",checkAuthenticated,(req,res)=>{
    let data = req.body;
    console.log("adding details");
    db.query("insert into review_details (id,location_rating,food_culture,residence_availability,risk_factors,best_season,experience) values (?,?,?,?,?,?,?)",
    [data.id,data.rating,data.foodCulture,data.residential,data.riskFactors,data.season,data.details],(err,result)=>{
        if(err){
            console.log(err)
            return res.send({status:false,error:err});
        }
        else{
            return res.send({status:true});
        }
    }
    )
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