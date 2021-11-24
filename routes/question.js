const express = require('express');
const db = require('../controllers/dbConnetcors');
const questionRouter = express.Router();
const rewardController = require('../controllers/reward');

questionRouter.post('/ask',(req,res)=>{
    let qData = req.body;
    qData.postDate = new Date(Date.now());
    db.query("insert into questions (review_id,user_id,question_text,post_time) values(?,?,?,?)",
    [qData.review_id,qData.user_id,qData.question,qData.postDate],(err,result)=>{
        if(err){
            return res.send({status:false,error:err});
        }
        else{
            qData.id = result.insertId;
            return res.send({status:true,question:qData});
        }
    })
});

questionRouter.post('/answer',(req,res)=>{
    let aData = req.body;
    aData.postDate = new Date(Date.now());
    db.query("insert into answers (question_id,user_id,answer,post_date) values(?,?,?,?)",
    [aData.question_id,aData.user_id,aData.answer,aData.postDate],(err,result)=>{
        if(err){
            return res.send({status:false,error:err});
        }
        else{
            aData.id = result.insertId;
            // rewardController.answerReward(aData.user_id);
            return res.send({status:true,answer:aData});
        }
    })
});

module.exports = questionRouter;