const db = require('../controllers/dbConnetcors');
const dompurify = require('dompurify');
const {JSDOM} = require('jsdom');
const htmlPurify = dompurify(new JSDOM().window);
const QUESTION = require('./question');
// import stripHtml from "string-strip-html";

let review = {}

review.getReview = async function getReview(id,done){
    let ret = {
        id:null,
        title:null,
        rating:null,
        location:{
            id:null,
            lat:null,
            lgn:null,
            category:null
        },
        location_rating:null,
        food_culture:null,
        residence_availability:null,
        risk_factors:null,
        best_season:null,
        experience:null,
        date:null,
        user:null,
        images:null,
        shorten:null,
        questions:null,
        ticks:null,
        tickMap:null,
        reports:null,
        reportMap:null
    };
    ret.id = id;
    await db.query("select * from review where id=?",[id],async (e1,r1)=>{

        if(e1)
            return done(e1,false);
        else{
            ret.title = r1[0].title;
            ret.rating = r1[0].rating;
            ret.location.id = r1[0].location;
            await db.query("select * from locations where id=?",[ret.location.id],async (e2,r2)=>{
                if(e1)
                    return done(e1,false);
                else{
                    ret.location.lat = r2[0].lat;
                    ret.location.lgn = r2[0].lgn;
                    ret.location.category = r2[0].category;
                    await db.query("select * from review_details where id=?",[ret.id],async (e3,r3)=>{
                        if(e3)
                            return done(e3,false);
                        else{
                            ret.location_rating = r3[0].location_rating;
                            ret.food_culture = r3[0].food_culture;
                            ret.residence_availability = r3[0].residence_availability;
                            ret.risk_factors = r3[0].risk_factors;
                            ret.best_season = r3[0].best_season;
                            ret.experience = r3[0].experience;
                            ret.shorten = ret.experience;
                            // ret.shorten = stripHtml(ret.shorten);
                            ret.shorten = ret.shorten.substring(0,150);
                            await db.query("select * from review_posting where review_id=?",[ret.id],async (e4,r4)=>{
                                if(e4)
                                    return done(e4,false);
                                else{
                                    ret.date = new Date(r4[0].post_date).toUTCString();
                                    const User = require('./user.js');
                                    await User.getUser(r4[0].user_id,async (e5,user)=>{
                                        if(e5)
                                            return done(e5,false);
                                        else{
                                            ret.user = user;
                                            await db.query("select * from review_images where review_id=?",[ret.id],async (e6,r6)=>{
                                                if(e6)
                                                    return done(e6,false);
                                                else{
                                                    let images = new Array();
                                                    for(let i=0;i<r6.length;i++){
                                                        images.push(r6[i].src);
                                                    }
                                                    ret.images = images;
                                                    await QUESTION.getReviewQuestion(ret.id,(e7,r7)=>{
                                                        if(e7)
                                                            return done(e7,false);
                                                        else{
                                                            ret.questions=r7;
                                                            db.query("select * from ticks where review_id=?",[ret.id],(e8,r8)=>{
                                                                if(e8)
                                                                    return done(e8,false);
                                                                else{
                                                                    let tickMap = new Map();
                                                                    for(let i=0;i<r8.length;i++){
                                                                        tickMap.set(r8[i].user_id,1);
                                                                    }
                                                                    ret.ticks = tickMap.size;
                                                                    ret.tickMap = tickMap;
                                                                    db.query("select * from reports where review_id=?",[ret.id],(e9,r9)=>{
                                                                        if(e9)
                                                                            return done(e9,false);
                                                                        else{
                                                                            let reportMap = new Map();
                                                                            for(let i=0;i<r9.length;i++){
                                                                                reportMap.set(r9[i].user_id,1);
                                                                            }
                                                                            ret.reports = reportMap.size;
                                                                            ret.reportMap = reportMap;
                                                                            return done(null,ret);
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    })
                                                }
                                            });
                                        }
                                    });
                                }
                            })
                        }
                    });
                }
            });
        }
    });
}


module.exports = review;