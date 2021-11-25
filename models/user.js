const db = require('../controllers/dbConnetcors');
const Review = require('./review');

let user = {}

user.columns = ["id","username","full_name","email","pass","confirmed","role","profile_picture","phone_number","hobby","points","favourite_places","hometown","country","birthdate"];
user.val = {};
user.getUser = async function getUser(id,done){
    let ret={};
    await db.query('SELECT * FROM user_main left join user_details on user_main.id=user_details.user_id  where user_main.id=?',[id],async (err,result)=>{
        if(err){
            console.log(err);
            if(done)
                return done(err,false);
        }
        else{
            if(result.length>0){
                user.columns.forEach(col => {
                    ret[col] = result[0][col];
                });
                let birthDate = new Date(ret.birthdate).toLocaleDateString();
                let b = birthDate.split('/');
                birthDate = b[2]+"-"+b[1]+"-"+b[0];
                ret.birthdate = birthDate;
                if(done)
                    return done(null,ret);
            }
        }
    });
}


module.exports = user;