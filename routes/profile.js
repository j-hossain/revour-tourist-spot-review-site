const express = require('express');
const User = require('../models/user');
const About = require('../models/user');
const Review = require('../models/review');
const db = require('../controllers/dbConnetcors');
const flash = require('express-flash');
const user = require('../models/user');
const profileRouter = express.Router();

profileRouter.get('/about/:id', async (req,res)=>{
    await About.getUser(req.params.id,async (err,user)=>{
        let about = user;
        await db.query("select * from review_posting where user_id=?",[about.id],async (e,reviews)=>{
            if(e)
                res.send(e);
            else{
                let reviewArray = new Array();
                let len = reviews.length;
                if(len==0){
                    about.reviews = new Array();
                    return res.render('profile/about',{user:req.user,about:about});
                }
                let cnt=0;
                reviews.forEach(async (review) => {
                    await Review.getReview(review.review_id,(ee,rev)=>{
                        reviewArray.push(rev);
                        cnt++;
                        if(cnt==len){
                            about.reviews = reviewArray;
                            return res.render('profile/about',{user:req.user,about:about});
                        }
                    });
                });
            }
        });
    });
});

profileRouter.get('/update/:id', checkAuthenticated, async (req,res)=>{
    res.render('profile/update',{user:req.user});
});

profileRouter.post("/update-picture",checkAuthenticated,(req,res)=>{
    let image = req.files.image;
    if(image){
        imagePath = Date.now() + image.name;
        let uploadPath =__dirname + '/../public/uploads/' + imagePath;
        image.mv(uploadPath,(err)=>{
            if(err){
                console.log(err);
                return res.send({status:404,err:err});
            }

            else{
                db.query("update user_details set profile_picture=? where user_id=?",[imagePath,req.user.id],(err,result)=>{
                    if(err){
                        return res.send({status:404,err:err});
                    }
                    else{
                        return res.send({status:400,src:imagePath});
                    }
                });
            }
        })
    }
})

profileRouter.post('/update',checkAuthenticated, async (req,res)=>{
    let upData = req.body;
    db.query("select * from user_main where username=? and id!=?",[upData.userName,req.user.id],(err,result)=>{
        if(err) {
            console.log(err);
            res.send(err);
            return;
        }
        else {
            if(result.length>0){
                res.send("Username already exists");
                return;
            }
            else{
                db.query("update user_main set username=?, full_name=? where id=?",[upData.userName,upData.fullName,req.user.id],(err,result)=>{
                    if(err){
                        return res.send(err);
                    }
                    else{
                        db.query("update user_details set phone_number=?,hobby=?,hometown=?,country=?,birthdate=? where user_id=?",[upData.phone,upData.hobby,upData.hometown,upData.country,upData.birthdate,req.user.id],(err,result)=>{
                            if(err){
                                console.log(err);
                            }
                            else{
                                return res.send("ok");
                            }
                        });
                    }
                });
            }
        }
    });
});

profileRouter.get('/rewards',checkAuthenticated,(req,res)=>{
    db.query("select * from user_details where user_id=?",[req.user.id],(err,result)=>{
        if(err)
            return res.send(err);
        else{
            let point = result[0].points;
            return res.render('profile/rewards',{user:req.user,point:point})
        }
    });
})

async function userNameAvailable(username){
    await db.query("select * from user_main where username=?",[username],(err,result)=>{
        console.log(result.length);
        if(err) {
            console.log(err);
            return false;
        }
        else {
            if(result.length>0)
                return false;
            else{
                return true;
            }
        }
    });
}

function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        return res.redirect('/auth/signin');
    }
}


module.exports = profileRouter;