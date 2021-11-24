const db = require('../controllers/dbConnetcors');
let question={}

question.getReviewQuestion = (reviewId,done)=>{
    db.query("select * from questions where review_id=?",[reviewId],async (err,questionList)=>{
        if(err){
            return done(err,false);
        }
        else{
            let questions = new Array();
            if(questionList.length==0){
                return done(null,questions);
            }
            for(let i=0;i<questionList.length;i++){
                let questionData = {
                    id:null,
                    user:null,
                    reviewId:reviewId,
                    question:null,
                    postDate:null
                }
                questionData.id = questionList[i].id;
                questionData.question = questionList[i].question_text;
                questionData.postDate = questionList[i].post_time;
                let USER = require('../models/user');
                await USER.getUser(questionList[i].user_id,(ee,user)=>{
                    if(ee){
                        return done(ee,false);
                    }
                    questionData.user = user;
                    questions.push(questionData);
                    if(questions.length==questionList.length)
                        return done(null,questions);
                })
            }
            // questionList.forEach(async (question) => {
            //     let questionData = {
            //         id:null,
            //         user:null,
            //         reviewId:reviewId,
            //         question:null,
            //         postDate:null
            //     }
            //     questionData.id = question.id;
            //     questionData.question = question.question_text;
            //     questionData.postDate = question.post_time;
            //     await USER.getUser(question.user_id,(ee,user)=>{
            //         if(ee){
            //             return done(ee,false);
            //         }
            //         questionData.user = user;
            //     })
            //     questions.push(questionData);
            //     if(questions.length==questionList.length)
            //         return done(null,questions);
            // });
        }
    });
}

module.exports = question;