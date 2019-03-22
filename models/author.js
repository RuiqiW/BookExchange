const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const AuthorSchema = new Schema(
  {
    first_name: {type: String, required: true, max: 100},
    family_name: {type: String, required: true, max: 100},
    books: [{type: Schema.Types.ObjectId, ref: 'Book', required: true}],
  }
);

// Virtual for author's full name
AuthorSchema
.virtual('name')
.get(function () {
  return this.family_name + ', ' + this.first_name;
});


// Virtual for author's URL
AuthorSchema
.virtual('url')
.get(function () {
  return '/catalog/author/' + this._id;
});





//Export model
module.exports = mongoose.model('Author', AuthorSchema);
