const db = require('./dbConnetcors');

let rewardController = {};

rewardController.tickReward = async (reviewId)=>{
    db.query("select * from rewards",(e1,rewards)=>{
        console.log("got rewards");
        if(e1)
            return console.log(e1);
        let max_tick = rewards[0].max_tick;
        let per_tick = rewards[0].per_tick;
        db.query("select * from ticks where review_id=?",[reviewId],(e2,ticks)=>{
            console.log("got ticks");
            if(e2)
                return console.log(e2);
            let total = ticks.length;
            if(total>max_tick){
                db.query("select * from review_posting where review_id=?",[reviewId],(e3,review)=>{
                    console.log("got review");
                    if(e3)
                        return console.log(e3);
                    let userId = review[0].user_id;
                    db.query("select * from user_details where user_id=?",[userId],(e4,user)=>{
                        console.log("got user");
                        if(e4)
                            return console.log(e4);
                        let currentPoint = user[0].points;
                        currentPoint+=per_tick;
                        db.query("update user_details set points=? where user_id=?",[currentPoint,userId],(e5,final)=>{
                            console.log("got updated");
                            if(e5)
                                return console.log(e5);
                        })
                    });
                });
            }
        });
    });
}

// rewardController.answerReward = async (userId)=>{
//     db.query("select * from rewards",(e1,rewards)=>{
//         if(e1)
//             return console.log(e1);
//         let max_answer = rewards[0].max_answer;
//         let per_answer = rewards[0].per_answer;
//         db.query("SELECT * FROM review_posting,questions,answers where review_posting.user_id=? and review_posting.review_id=questions.review_id and questions.id=answers.question_id",[userId],(e2,answers)=>{
//             if(e2)
//                 return console.log(e2);
//             let total = answers.length;
//             if(total>max_answer){
//                 db.query("select * from user_details where user_id=?",[userId],(e4,user)=>{
//                     if(e4)
//                         return console.log(e4);
//                     let currentPoint = user[0].points;
//                     currentPoint+=per_answer;
//                     db.query("update user_details set points=? where user_id=?",[currentPoint,userId],(e5,final)=>{
//                         console.log("got updated");
//                         if(e5)
//                             return console.log(e5);
//                     })
//                 });
//             }
//         });
//     });
// }

// rewardController.uniqueLocationReward = async (userId)=>{
//     db.query("select * from rewards",(ee,rewards)=>{
//         let uniqeReward = rewards[0].unique_location;
//         db.query("select * from user_details where user_id=?",[userId],(err,result)=>{
//             let currentPoint = result[0].points;
//             currentPoint+=uniqeReward;
//             db.query("update user_details set points=? where user_id=?",[currentPoint,userId],(er,final)=>{
//                 if(e5)
//                     return console.log(e5);
//             })
//         });
//     })
// }

module.exports = rewardController;