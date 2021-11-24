const bodyParser = require('body-parser');
const db = require('../controllers/dbConnetcors');
let question={}

question.getReviewQuestion = (reviewId,done)=>{
    db.query("select * from questions where review_id=?",[reviewId],async (e1,questionList)=>{
        if(e1){
            return done(e1,false);
        }
        else{
            let questions = new Array();
            if(questionList.length==0){
                return done(null,questions);
            }
            else{
                for(let i=0;i<questionList.length;i++){
                    let questionData = {
                        id:null,
                        user:null,
                        reviewId:reviewId,
                        question:null,
                        postDate:null,
                        answered:false,
                        answers:null
                    }
                    questionData.id = questionList[i].id;
                    questionData.question = questionList[i].question_text;
                    questionData.postDate = questionList[i].post_time;
                    let USER = require('../models/user');
                    await USER.getUser(questionList[i].user_id,(e2,user)=>{
                        if(e2){
                            return done(e2,false);
                        }
                        else{
                            questionData.user = user;
                            db.query("select * from answers where question_id=?",[questionData.id],(e3,answers)=>{
                                if(e3){
                                    return done(e3,false);
                                }
                                else{
                                    let answerArray = new Array();
                                    if(answers.length==0){
                                        questionData.answered=false;
                                        questionData.answers = answerArray;
                                        questions.push(questionData);
                                        if(questions.length==questionList.length)
                                            return done(null,questions);
                                    }
                                    else{
                                        for(let i=0;i<answers.length;i++){
                                            let answer={
                                                id:answers[i].id,
                                                questionId:answers[i].question_id,
                                                userId:answers[i].user_id,
                                                text:answers[i].answer,
                                                postDate:answers[i].post_date,
                                            }
                                            answerArray.push(answer);
                                        }
                                        questionData.answered=true;
                                        questionData.answers = answerArray;
                                        questions.push(questionData);
                                        if(questions.length==questionList.length)
                                            return done(null,questions);
                                    }
                                }
                            });
                        }
                    });
                }
            }
        }
    });
}

module.exports = question;