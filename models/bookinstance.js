const mongoose = require('mongoose');
const Schema = mongoose.Schema;




const BookInstanceSchema = new Schema(
  {
    book: { type: Schema.Types.ObjectId, ref: 'Book', required: true }, //reference to the associated book
    condition: {type: String, required: true, enum: ['New', 'Like New', 'Very Good', 'Good', 'Acceptable'], default: 'New'},
    status: {type: String, required: true, enum: ['Available', 'Sold', 'Pending', 'Reserved'], default: 'Available'},
    price: {type: Number}
  }
);



// Virtual for bookinstance's URL
BookInstanceSchema
.virtual('url')
.get(function () {
  return '/catalog/bookinstance/' + this._id;
});




const BookInstanceModel = mongoose.model('BookInstance', BookInstanceSchema);

//Export model
module.exports = BookInstanceModel;
