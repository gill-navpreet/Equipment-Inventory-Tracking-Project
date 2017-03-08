var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var titlize = require('mongoose-title-case');

var UserSchema = new Schema({
  name: { type: String, lowercase: true, required: true },
  username: { type: String, lowercase: true, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, unique: true, select: false },
  permission: { type: String, required: true, default: 'user' }
});

UserSchema.pre('save', function(next){
  var user = this;
  //checks if the user modified the password, if not, it doesn't run the hash function which was changing the password on us
  if (!user.isModified('password')) return next();
  bcrypt.hash(user.password, null, null, function(err,hash) {
    if(err) return next(err);
    user.password = hash;
    next();
  });
});


UserSchema.methods.comparePassword = function(password) {
	return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);