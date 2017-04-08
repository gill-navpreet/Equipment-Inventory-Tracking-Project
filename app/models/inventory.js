var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var InventorySchema = new Schema({
	product: { type: String, lowercase: true, required: true },
	barcode: { type: Number, required: true, unique: true },
	isCheckedIn: { type: String, required: true, default: true},
	dateCheckedOut: { type: Date},
	dateCheckedIn: { type: Date, required: true, default: Date},
	firstName: { type: String, lowercase: true, default: 'n/a'},
	lastName: { type: String, lowercase: true, default: 'n/a' },
	email: { type: String, lowercase: true, default: 'n/a' },
	phoneNumber: { type: String },
	supervisorFirstName: { type: String, default: 'n/a' },
	supervisorLastName: { type: String, default: 'n/a' },
	supervisorEmail: { type: String, default: 'n/a' },
	supervisorPhoneNumber: { type: String },
	title: { type: String, default: 'n/a'},
	department: { type: String, default: 'n/a'}, 
	location: { type: String, default: 'n/a'},
	chargeNumber: { type: String },
	emailSent: { type: String, default: 'false' }

});


module.exports = mongoose.model('InventoryForm',InventorySchema);