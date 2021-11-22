const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const db = require('./controllers/dbConnetcors');
const User = require('./models/user');
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
                        email:results[0].email,
                        password:results[0].pass,
                        confirmed: results[0].confirmed
                    }
                    try{
                        if(await bcrypt.compare(password,user.password)){
                            if(user.confirmed=="true"){
                                return done(null,user);
                            }
                            else{
                                return done(null,false,{message:'please varify your email first'});
                            }
                        }else{
                            return done(null,false,{message:'password did not match'});
                        }
                    }
                    catch(e){
                        return done(e,false);
                    }
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
        let user = await User.getUser(id,done);
    });
}

module.exports = initialize;