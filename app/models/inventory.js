var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var InventorySchema = new Schema({
	product: { type: String, lowercase: true, required: true },
	firstName: { type: String, lowercase: true, default: 'n/a'},
	lastName: { type: String, lowercase: true, default: 'n/a' },
	email: {type: String, lowercase: true, default: 'n/a' },
	barcode: {type: Number, required: true, unique: true },
	isCheckedIn: {type: String, required: true, default: true}
});

module.exports = mongoose.model('InventoryForm',InventorySchema);