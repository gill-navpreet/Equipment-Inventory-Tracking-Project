var mongoose = require('mongoose'); // Import Mongoose Package
var mongooseToCsv = require('mongoose-to-csv'); // Import Mongoose csv files Plugin
var Schema = mongoose.Schema; // Assign Mongoose Schema function to variable


// Define the mongoose schema for history
// Each schema maps to a MongoDB collection and defines the shape of the documents within that collection
var HistorySchema = new Schema({
	product: { type: String, lowercase: true, required: true, default: ' ' },
	barcode: { type: Number, required: true},	
	checkedType: { type: String, required: true, default: ' '},
	firstName: { type: String, lowercase: true, default: ' '},
	lastName: { type: String, lowercase: true, default: ' ' },
	email: {type: String, lowercase: true, default: ' ' },	
	date: { type: Date, required: true, default: Date},
	description: { type: String, default: 'description'},
	phoneNumber: { type: String, default: ' ' },
	supervisorFirstName: { type: String, default: ' ' },
	supervisorLastName: { type: String, default: ' ' },
	supervisorEmail: { type: String, default: ' ' },
	supervisorPhoneNumber: { type: String, default: ' ' },
	title: { type: String, default: ' '},
	department: { type: String, default: ' '}, 
	location: { type: String, default: ' '},
	chargeNumber: { type: String, default: ' ' }

});

// Moongoose plugin that creates a CsvBuilder instance for history Schema
HistorySchema.plugin(mongooseToCsv, {
	// define headers and order of headers
	headers: 'Date Product Barcode Status First-Name Last-Name Email Phone-Number Supervisor-First-Name Supervisor-Last-Name Supervisor-Email Supervisor-Phone-Number Title Department Charge-Number Description',
	// define object to header correspondance
	constraints: {
		'Date': 'date',
		'Product': 'product',
		'Barcode': 'barcode',
		'Status': 'checkedType',
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
		'Description': 'description'
	}
});

// Export to server file
module.exports = mongoose.model('History',HistorySchema);