const mongoose = require('mongoose');
const Schema = mongoose.Schema;


/** Define the UserSchema */
const UserSchema = new Schema(
  {
    first_name: {type: String, required: true, max: 30},
    family_name: {type: String, required: true, max: 30},
    date_of_birth: {type: Date},
  }
);


// Virtual for user's full name
// UserSchema
// .virtual('name')
// .get(function () {
//   return this.family_name + ', ' + this.first_name;
// });
UserSchema.virtual('name').get(() => this.family_name + ', ' + this.first_name);


// Virtual for user's URL
// UserSchema
// .virtual('url')
// .get(function () {
//   return '/catalog/author/' + this._id;
// });
// UserSchema.virtual('url').get(() => '/catalog/user/' + this._id);


/** Define the UserModel */
const UserModel = mongoose.model('User', UserSchema);

// Export model
module.exports = UserModel;
