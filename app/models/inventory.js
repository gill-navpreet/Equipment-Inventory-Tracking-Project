var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var InventorySchema = new Schema({
	firstName: { type: String, lowercase: true, required: true },
	lastName: { type: String, lowercase: true, required: true },
	email: {type: String, lowercase: true, required: true },
	barcode: {type: Number, required: true, unique: true },
	isCheckedIn: {type: Boolean, required: true, default: true}
});

module.exports = mongoose.model('InventoryForm',InventorySchema);