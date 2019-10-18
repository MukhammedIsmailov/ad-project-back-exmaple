const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcrypt');
const SECRET = process.env.SECRET;
const Users = require('./DB/models/users');

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, function (username, password, done) {

  Users.findOne({ email: username }, function (err, user) {
    if (user !== null) {
      bcrypt.compare(password, user.password, function (err, res) {
        let checkpass = res;
        return err
          ? done(err)
          : user
            ? checkpass
              ? done(null, user)
              : done(null, false, { message: 'Incorrect password.' })
            : done(null, false, { message: 'Incorrect username.' });
      });
    } else return done(null, false, { message: 'User not found.' } )
  });
}));

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken('authorization');
opts.secretOrKey = SECRET;

passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
  Users.findById(jwt_payload._id, function (err, user) {
    if (err) {
      return done(err, false);
    }
    if (user) {
      return done(null, user);
    } else {
      return done(null, false, { message: 'You should login' });
      // or you could create a new account
    }
  });
}));
