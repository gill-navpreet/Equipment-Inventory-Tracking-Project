var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var InventorySchema = new Schema({
	product: { type: String, lowercase: true, required: true },
	firstName: { type: String, lowercase: true, default: ' '},
	lastName: { type: String, lowercase: true, default: ' ' },
	email: {type: String, lowercase: true, default: ' ' },
	barcode: {type: Number, required: true, unique: true },
	isCheckedIn: {type: Boolean, required: true, default: true}
});

module.exports = mongoose.model('InventoryForm',InventorySchema);