const express = require('express');
const authRouter = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../controllers/dbConnetcors');
const passport = require('passport');
const slugify = require('slugify');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user: process.env.MAIL_ID,
        pass: process.env.MAIL_PASS
    }
});

authRouter.get('/signin',checkAuthenticated, async (req,res)=>{
    res.render('auth/signin');
});

authRouter.post('/signin', passport.authenticate('local',{
    successRedirect: '/profile/about',
    failureRedirect: '/auth/signin',
    failureFlash:true,
}));

authRouter.get('/signup',checkAuthenticated, async (req,res)=>{
    res.render('auth/signup');
});

authRouter.post('/signup', async (req,res)=>{
    
    const {fNameInp,lNameInp,mailInp,passInp,conPassInp} = req.body;
    db.query("select * from user_main where email = ?",[mailInp],async (err,results)=>{
        if(err){
            console.log(err);
        }
        if(results.length>0){
            console.log("email exists");
            return res.redirect('/auth/signup');;
        }
        if(passInp != conPassInp){
            console.log("passwords dont match");
            return res.redirect('/auth/signup');;
        }

        let hashedPass = await bcrypt.hash(passInp,10);
        db.query("insert into user_main set ?",{
            username: fNameInp,
            full_name: fNameInp+" "+lNameInp,
            email: mailInp,
            pass: hashedPass
        },(err,results)=>{
            if(err){
                console.log(err);
                res.redirect('/auth/signup');
            }
            else{
                sendConfirmationMail(mailInp);
                res.redirect('/auth/signin');
            }
        });
    });
});
authRouter.delete('/signout',(req,res)=>{
    req.logOut();
    res.redirect('/');
});

authRouter.get('/confirm/:id/:slug',async (req,res)=>{
    db.query('select * from user_main where id=?',[req.params.id],async (err,results)=>{
        if(err || results.length<0){
            console.log(err);
            res.redirect('/');
        }
        else if(results[0].confirmed=="true"){
            res.redirect('/auth/signin');
        }
        else{
            let checker = slugify(results[0].confirmed,{lower: true, strict: true});
            if(req.params.slug==checker){
                db.query('update user_main set confirmed="true" where id=?',[req.params.id],(err,results)=>{
                    if(err)
                        console.log(err);
                    res.redirect('/auth/signin');
                });
            }
            else{
                res.redirect('/');
            }
        } 
    });
});

function sendConfirmationMail(email){
    db.query('select * from user_main where email=?',[email],async (err,results)=>{
        if(err){
            console.log(err);
        }
        else{
            let id= results[0].id;
            let key = results[0].confirmed;
            let slug = slugify(key,{lower: true, strict: true});;
            url = "http://localhost:3000/auth/confirm/"+id+"/"+slug;
            const mailOptions = {
                from: 'Revour',
                to: email,
                subject: 'Varify your Account',
                text: "Click this link to varify your Revour Account - "+url
            };44
            transporter.sendMail(mailOptions,(err,info)=>{
                if(err)
                    console.log(err);
                else
                    console.log(info);
            });
        }
    });
}


function checkAuthenticated(req, res, next){
    if(!req.isAuthenticated()){
        return next();
    }
    else{
        return res.redirect('/profile/about');
    }
}
 
module.exports = authRouter;