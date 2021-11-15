const db = require('../controllers/dbConnetcors');

let user = {}

user.columns = ["id","username","full_name","email","pass","confirmed","role","profile_picture","slogan","phone_number","hobby","points","favourite_places","hometown","country","birthdate"];
user.val = {};
user.getUser = async function getUser(id,done){
    await db.query('SELECT * FROM user_main left join user_details on user_main.id=user_details.user_id  where user_main.id=?',[id], async (err,result)=>{
        if(err){
            console.log(err);
            return done(err,false);
        }
        else{
            if(result.length>0){
                user.columns.forEach(col => {
                    user.val[col] = result[0][col];
                });

                return done(null,user.val);
            }
        }
    });
}

module.exports = user;