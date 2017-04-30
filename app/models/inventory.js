var mongoose = require('mongoose'); // Import Mongoose Package
var mongooseToCsv = require('mongoose-to-csv'); // Import Mongoose csv files Plugin
var Schema = mongoose.Schema; // Assign Mongoose Schema function to variable

// Define the mongoose schema for inventory
// Each schema maps to a MongoDB collection and defines the shape of the documents within that collection
var InventorySchema = new Schema({
	product: { type: String, lowercase: true, required: true },
	barcode: { type: Number, required: true, unique: true },
	isCheckedIn: { type: String, required: true, default: true},
	dateCheckedOut: { type: Date},
	dateCheckedIn: { type: Date, required: true, default: Date},
	firstName: { type: String, lowercase: true, default: ' '},
	lastName: { type: String, lowercase: true, default: ' ' },
	email: { type: String, lowercase: true, default: ' ' },
	phoneNumber: { type: String },
	supervisorFirstName: { type: String, default: ' ' },
	supervisorLastName: { type: String, default: ' ' },
	supervisorEmail: { type: String, default: ' ' },
	supervisorPhoneNumber: { type: String },
	title: { type: String, default: ' '},
	department: { type: String, default: ' '}, 
	location: { type: String, default: ' '},
	chargeNumber: { type: String },
	emailSent: { type: String, default: 'false' },
	isDeleted: { type: String, default: 'false' },
	batteryTotalTime: { type: Number, default: 0},
	batteryLifeTime: { type: Number, default: 10000}

});

// Moongoose plugin that creates a CsvBuilder instance for hinventory Schema
InventorySchema.plugin(mongooseToCsv, {
	// define headers and order of headers
	headers: 'Product Barcode Status Date-Checked-Out Date-Checked-In First-Name Last-Name Email Phone-Number Supervisor-First-Name Supervisor-Last-Name Supervisor-Email Supervisor-Phone-Number Title Department Charge-Number',
	// define object to header correspondance
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

// Export to server file
module.exports = mongoose.model('InventoryForm',InventorySchema);