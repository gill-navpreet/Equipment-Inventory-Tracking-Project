var mongoose = require('mongoose');
var mongooseToCsv = require('mongoose-to-csv');
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

InventorySchema.plugin(mongooseToCsv, {
	headers: 'Product Barcode Status Date-Checked-Out Date-Checked-In First-Name Last-Name Email Phone-Number Supervisor-First-Name Supervisor-Last-Name Supervisor-Email Supervisor-Phone-Number Title Department Charge-Number',
	constraints: {
		'Product': 'product',
		'Barcode': 'barcode',
		'Status': 'isCheckedIn',
		'Date-Checked-Out': 'dateCheckedOut',
		'Date-Checked-In': 'dateCheckedIn',
		'First-Name': 'firstName',
		'Last-Name': 'lastName',
		'Email': 'email',
		'Phone-Number': 'phoneNumber',
		'Supervisor-First-Name': 'supervisorFirstName',
		'Supervisor-Last-Name': 'supervisorLastName',
		'Supervisor-Email': 'supervisorEmail',
		'Supervisor-Phone Number': 'supervisorPhoneNumber',
		'Title': 'title',
		'Department': 'department',
		'Location': 'location',
		'Charge-Number': 'chargeNumber',
	}
});


module.exports = mongoose.model('InventoryForm',InventorySchema);