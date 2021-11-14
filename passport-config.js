const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const db = require('./controllers/dbConnetcors');
function initialize(passport){
    const authenticateUser = async (email,password,done)=>{
        let user;
        await db.query('select * from user_main where email=?',[email],async (err,results)=>{
            if(err)
                console.log(err);
            else{
                if(results.length>0){
                    user = {
                        id: results[0].id,
                        username: results[0].username,
                        email:results[0].email,
                        password:results[0].pass,
                        name: results[0].full_name,
                        confirmed: results[0].confirmed
                    }
                    return done(null,user);
                }
                else{
                    return done(null,false,{message:'No user with the email'});
                }
            }
        });
    }
    passport.use(new localStrategy({
        usernameField:'email'
    },authenticateUser));
    passport.serializeUser((user,done)=>{
        done(null,user.id);
    });
    passport.deserializeUser(async (id,done)=>{
        let user;
        await db.query('select * from user_main where id=?',[id],async (err,results)=>{
            if(err)
                return done(err,false)
            else{
                if(results.length>0){
                    user = {
                        id: results[0].id,
                        email:results[0].email,
                        password:results[0].pass,
                        username: results[0].username,
                        name: results[0].full_name,
                        role: results[0].role
                    }
                    return done(null,user);
                }
                else{
                    return done(err,false)
                }
            }
        });
    });
}

module.exports = initialize;