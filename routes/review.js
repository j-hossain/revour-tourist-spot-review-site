const express = require('express');
const reviewRouter = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../controllers/dbConnetcors');
const passport = require('passport');
const slugify = require('slugify');
const REVIEW = require('../models/review');
const review = require('../models/review');
const user = require('../models/user');
const rewardController = require('../controllers/reward');

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

reviewRouter.get('/getbyid/:id',async (req,res)=>{
    await REVIEW.getReview(req.params.id,(err,review)=>{
        if(err)
            return res.send(err);
        else{
            return res.send(review)
        }
    });
})

reviewRouter.post('/insert',checkAuthenticated,(req,res)=>{
    console.log("creating review");
    db.query("insert into review (title,location) values(?,?)",[req.body.title,req.body.location],(err,result)=>{
        if(err){
            res.send({status:false,error:err});
            return;
        }
        else{
            let reviewId = result.insertId;
            db.query("insert into review_posting (review_id,user_id,post_date) values (?,?,?)",[reviewId,req.user.id,new Date(Date.now())],(er,rows)=>{
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

reviewRouter.delete("/deleteimages/:id",checkAuthenticated,(req,res)=>{
    console.log("deleting images");
    
    db.query("delete from review_images where review_id=?",[req.params.id],(err,result)=>{
        if(err){
            console.log(err);
            return res.send({status:false,error:err});
        }
        else{
            return res.send({status:true});
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
reviewRouter.post("/updatedetails",checkAuthenticated,(req,res)=>{
    let data = req.body;
    console.log("updating details");
    db.query("update review_details  set location_rating=?,food_culture=?,residence_availability=?,risk_factors=?,best_season=?,experience=? where id=?",
    [data.rating,data.foodCulture,data.residential,data.riskFactors,data.season,data.details,data.id],(err,result)=>{
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

reviewRouter.get('/getall',(req,res)=>{
    db.query("select * from review",(err,reviewData)=>{
        if(reviewData.length>0){
            let reviews = new Array();
            reviewData.forEach(async (review) => {
                await REVIEW.getReview(review.id,(ee,rev)=>{
                    if(ee)
                        return res.send(ee);
                    else{
                        reviews.push(rev);
                        if(reviews.length==reviewData.length){
                            return res.send(reviews);
                        }
                    }
                })
            });
        }
    });
});

reviewRouter.post('/react/tick/:review/:user',checkAuthenticated,(req,res)=>{
    db.query("insert into ticks (review_id,user_id,pTime) values(?,?,?)",
    [req.params.review,req.params.user,new Date(Date.now())],(err,result)=>{
        if(err)
            return res.send({status:false,error:err});
        else{
            rewardController.tickReward(req.params.review);
            return res.send({status:true});
        }
    });
});
reviewRouter.post('/react/report/:review/:user',checkAuthenticated,(req,res)=>{
    db.query("insert into reports (review_id,user_id,pTime) values(?,?,?)",
    [req.params.review,req.params.user,new Date(Date.now())],(err,result)=>{
        if(err)
            return res.send({status:false,error:err});
        else{
            return res.send({status:true});
        }
    });
});

reviewRouter.get('/delete/:id',(req,res)=>{
    let reviewId = req.params.id;
    db.query("delete from review where id=?",[reviewId],(e1,r1)=>{
        if(e1)
            return res.send(e1);
        else{
            db.query("delete from review_posting where review_id=?",[reviewId],(e2,r2)=>{
                if(e2)
                    return res.send(e2);
                else{
                    db.query("delete from review_details where id=?",[reviewId],(e3,r3)=>{
                        if(e3)
                            return res.send(e3);    
                        else{
                            db.query("delete from reports where review_id=?",[reviewId],(e4,r4)=>{
                                if(e4)
                                    return res.send(e4);
                                else{
                                    db.query("delete from review_images where review_id=?",[reviewId],(e5,r5)=>{
                                        if(e5)
                                            return res.send(e5);
                                        else{
                                            db.query("delete from questions where review_id=?",[reviewId],(e6,r6)=>{
                                                if(e6)
                                                    return res.send(e6);
                                                else{
                                                    db.query("delete from ticks where review_id=?",[reviewId],(e7,r7)=>{
                                                        if(e1)
                                                            return res.send(e1);
                                                        else{
                                                            return res.redirect('/');
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
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