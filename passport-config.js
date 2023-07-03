const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt');
const fs = require ("fs");

//  HASH THE STORED PASSWORD
let loginHash;
(async function hashPassword() {
    try {
        loginHash = await bcrypt.hash(process.env.LOGIN_PASSWORD, 10);
    } catch (err) {
        console.log(err);
    }
})();

const authenticateUser = async (username, password, done) => {
    try {
        if (await validatePassword(password) === true) {
            return done(null, {username: 'admin', id: '1'});
        } else {
            return done(null, false, { message: 'Password incorrect.' })
        }
    } catch (e) {
        return done(e);
    }
}

async function validatePassword(password) {
    try {
        const result = await bcrypt.compare(password, loginHash);
        return result;
    } catch (e) {
        console.log(e);
    }
}

passport.use(new LocalStrategy(authenticateUser));

passport.serializeUser((user, done) => done(null, 'admin'));

passport.deserializeUser((id, done) =>  {
    return done(null, '1');
});

module.exports.authenticateUser = authenticateUser;