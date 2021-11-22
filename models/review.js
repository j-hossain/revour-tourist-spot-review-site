const db = require('../controllers/dbConnetcors');


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
        images:null
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
                            await db.query("select * from review_posting where review_id=?",[ret.id],async (e4,r4)=>{
                                if(e4)
                                    return done(e4,false);
                                else{
                                    ret.date = r4[0].post_date;
                                    const User = require('./user.js');
                                    await User.getUser(r4[0].user_id,async (e5,user)=>{
                                        if(e5)
                                            return done(e5,false);
                                        else{
                                            ret.user = user;
                                            await db.query("select * from review_images where id=?",[ret.id],async (e6,r6)=>{
                                                if(e6)
                                                    return done(e6,false);
                                                else{
                                                    let images = new Array();
                                                    for(let i=0;i<r6.length;i++){
                                                        images.push(r6[i].src);
                                                    }
                                                    ret.images = images;
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
    });
}


module.exports = review;