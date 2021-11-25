const express = require('express');
const redeemRouter = express.Router();
const db = require('../controllers/dbConnetcors');
const USER = require('../models/user');

redeemRouter.post('/request',checkAuthenticated,(req,res)=>{
    let requestData = req.body;
    db.query("insert into redeem_requests (user_id,requested_point,status) values(?,?,?)",[requestData.user_id,requestData.redeem_point,"pending"],(err,result)=>{
        if(err){
            return res.send({status:false,error:err});
        }
        else{
            //user_details theke point komate hobe
            db.query("select * from user_details where user_id=?",[requestData.user_id],(er,userDetails)=>{
                if(er)
                    return res.send({status:false,error:er});
                else{
                    let currentPoint = userDetails[0].points;
                    currentPoint-=requestData.redeem_point;
                    //ekhon point update kore dibo
                    db.query("update user_details set points=? where user_id=?",[currentPoint,requestData.user_id],(ee,final)=>{
                        if(ee)
                            return res.send({status:false,error:ee});
                        else{
                            return res.send({status:true});
                        }
                    });
                }
            });
        }
    });
});

redeemRouter.get('/cancle/:id',checkAuthenticated,(req,res)=>{
    db.query("select * from redeem_requests where id=?",[req.params.id],(e1,request)=>{
        if(e1){
            return res.send({status:false,error:e1});
        }
        else{
            let req_point = request[0].requested_point;
            let userId = request[0].user_id;
            // jodi onno keu request dae !!
            if(userId!=req.user.id){
                return res.send({status:false,error:"Access not granted"});
            }
            else if(request[0].status!="pending"){
                return res.send({status:false,error:"Cannot revert a request when it is already processed"});
            }
            else{
                db.query("delete from redeem_requests where id=?",[req.params.id],(err,result)=>{
                    if(err){
                        return res.send({status:false,error:err});
                    }
                    else{
                        //user_details theke point nite hobe
                        db.query("select * from user_details where user_id=?",[req.user.id],(er,userDetails)=>{
                            if(er)
                                return res.send({status:false,error:er});
                            else{
                                let currentPoint = userDetails[0].points;
                                currentPoint+=req_point;
                                //ekhon point update kore dibo
                                db.query("update user_details set points=? where user_id=?",[currentPoint,req.user.id],(ee,final)=>{
                                    if(ee)
                                        return res.send({status:false,error:ee});
                                    else{
                                        return res.send({status:true});
                                    }
                                });
                            }
                        });
                    }
                });
            }
        }
    });
});

redeemRouter.post('/confirm/:id',(req,res)=>{
    db.query("update redeem_requests set status='completed' where id=?",[req.params.id],(err,result)=>{
        if(err){
            return res.send({status:false,error:err});
        }
        else{
            return res.send({status:true});
        }
    });
});

redeemRouter.get('/accept/:id/:trx',checkAuthenticated,checkMod,(req,res)=>{
    db.query("select * from redeem_requests where id=?",[req.params.id],(e1,request)=>{
        if(e1){
            return res.send({status:false,error:e1});
        }
        else if(req.user.id==request[0].user_id){
            return res.send({status:false,error:"You cannot accept your own request"});
        }
        else{
            db.query("update redeem_requests set status='accepted',accepted_by=?,trx_id=? where id=?",[req.user.id,req.params.trx,req.params.id],(err,result)=>{
                if(err){
                    return res.send({status:false,error:err});
                }
                else{
                    return res.send({status:true});
                }
            });
        }
    })
});

redeemRouter.get('/user-requests/:userid',(req,res)=>{
    db.query("select * from redeem_requests where user_id=?",[req.params.userid], async (err,requests)=>{
        if(err){
            return res.send({status:false,error:err});
        }
        else{
            let requestArray = new Array();
            for (let i=0;i<requests.length;i++){
                let reqst = {
                    id:requests[i].id,
                    user_id:requests[i].user_id,
                    req_point:requests[i].requested_point,
                    status:requests[i].status,
                    trx_id:requests[i].trx_id,
                    user:null
                }
                await USER.getUser(reqst.user_id,(err,user)=>{
                    if(!err){
                        reqst.user = user;
                        requestArray.push(reqst);
                        if(i==requests.length-1)
                            return res.send({status:true,requests:requestArray});
                    }
                })
            }
        }
    });
});

redeemRouter.get('/all-requests',(req,res)=>{
    db.query("select * from redeem_requests",async (err,requests)=>{
        if(err){
            return res.send({status:false,error:err});
        }
        else{
            let requestArray = new Array();
            for (let i=0;i<requests.length;i++){
                let reqst = {
                    id:requests[i].id,
                    user_id:requests[i].user_id,
                    req_point:requests[i].requested_point,
                    status:requests[i].status,
                    trx_id:requests[i].trx_id,
                    accepted_by:requests[i].accepted_by,
                    user:null
                }
                await USER.getUser(reqst.user_id,(err,user)=>{
                    if(!err){
                        reqst.user = user;
                        requestArray.push(reqst);
                        if(i==requests.length-1)
                            return res.send({status:true,requests:requestArray});
                    }
                })
            }
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


module.exports = redeemRouter;