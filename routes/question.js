const express = require('express');
const db = require('../controllers/dbConnetcors');
const questionRouter = express.Router();

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

module.exports = questionRouter;