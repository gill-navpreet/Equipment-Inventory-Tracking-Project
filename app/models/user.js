var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs'); // for password encryption
var titlize = require('mongoose-title-case');

// Define the mongoose schema 
var UserSchema = new Schema({
  name: { type: String, lowercase: true, required: true },
  // unique ensures only one user
  username: { type: String, lowercase: true, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, unique: true },
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

// Function validates password by comparing password provided by user to the "this" user password
// returns true or false value
UserSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

// Export to server file
module.exports = mongoose.model('User', UserSchema);