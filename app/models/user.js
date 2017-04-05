var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs'); // for password encryption
var titlize = require('mongoose-title-case'); // Import Mongoose Title Case Plugin
var validate = require('mongoose-validator');

// User Name Validator
var nameValidator = [
    validate({
        validator: 'matches',
        arguments: /^(([a-zA-Z]{3,20})+[ ]+([a-zA-Z]{3,20})+)+$/,
        message: 'Name must be at least 3 characters, max 30, no special characters or numbers, must have space in between name.'
    }),
    validate({
        validator: 'isLength',
        arguments: [3, 20],
        message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters'
    })
];

// User E-mail Validator
var emailValidator = [
    validate({
        validator: 'isEmail',
        message: 'Email is not Valid.'
    }),
    validate({
        validator: 'isLength',
        arguments: [3, 40],
        message: 'Email should be between {ARGS[0]} and {ARGS[1]} characters'
    })
];

// Username Validator
var usernameValidator = [
    validate({
        validator: 'isLength',
        arguments: [3, 25],
        message: 'Username should be between {ARGS[0]} and {ARGS[1]} characters'
    }),
    validate({
        validator: 'isAlphanumeric',
        message: 'Username must contain letters and numbers only'
    })
];

// Password Validator
var passwordValidator = [
    validate({
        validator: 'matches',
        arguments: /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/,
        message: 'Password needs to have at least one lower case, one uppercase, one number, one special character, and must be at least 8 characters but no more than 35.'
    }),
    validate({
        validator: 'isLength',
        arguments: [8, 35],
        message: 'Password should be between {ARGS[0]} and {ARGS[1]} characters'
    })
];

// Define the mongoose schema 
var UserSchema = new Schema({
  name: { type: String, required: true, validate: nameValidator },
  // unique ensures only one user
  username: { type: String, lowercase: true, required: true, unique: true , validate: usernameValidator },
  password: { type: String, required: true,  validate: passwordValidator},
  email: { type: String, required: true, lowercase: true, unique: true ,validate: emailValidator },
  permission: { type: String, required: true, default: 'user' }
});

// Before saving the schema, encrypt password
UserSchema.pre('save', function(next){
  // current user
  var user = this;
  //checks if the user modified the password, if not, it doesn't run the hash function which was changing the password on us
  if (!user.isModified('password')) return next();
  bcrypt.hash(user.password, null, null, function(err,hash) {
    if(err) return next(err);
    user.password = hash;
    next();
  });
});

// Mongoose Plugin to change fields to title case after saved to database (ensures consistency)
UserSchema.plugin(titlize, {
    paths: ['name']
});

// Function validates password by comparing password provided by user to the "this" user password
// returns true or false value
UserSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

// Export to server file
module.exports = mongoose.model('User', UserSchema);