/*globals require, module */

const mongoose = require("mongoose"),
    bcrypt = require('bcryptjs'),
    mongoosePaginate = require('mongoose-paginate'),
    Schema = mongoose.Schema;
/**
 * @typedef User
 * @property {number} _id
 * @property {string} email.required
 * @property {Array.<string>} features
 * @property {string} firstName.required
 * @property {string} lastName.required
 * @property {string} password.required
 * @property {string} role
 * @property {string} lastUpdateBy - updated by user
 */
// create a schema for User
let userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    pass: {
        type: String,
        required: true
    },
    role: String,
    lastUpdate: {
        type: Date, default: new Date().toISOString()
    },
    lastLogin: {
        type: Date, default: new Date().toISOString()
    },
    lastUpdateBy: String,
    features: Array
}, {collection: 'user', versionKey: false});
userSchema.plugin(mongoosePaginate);
//IF YOU WANT TO ENCRYPT PASSWORD, USE THIS APPROACH.
/*userSchema.pre('save', function (next) {
    var user = this;
    if (!user.isModified('password')) {return next()}
    bcrypt.hash(user.password,10).then((hashedPassword) => {
        user.password = hashedPassword;
        next();
    });
}, function (err) {
    next(err)
});
userSchema.methods.comparePassword=function(candidatePassword,next){
    bcrypt.compare(candidatePassword,this.password,function(err,isMatch){
    if(err) return next(err);
    next(null,isMatch)
});
};*/


// Create a model using schema
let User = mongoose.model("user", userSchema);

// make this model available
module.exports = User;