var mongoose = require('mongoose');
var mongooseToCsv = require('mongoose-to-csv');
var Schema = mongoose.Schema;


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


HistorySchema.plugin(mongooseToCsv, {
	headers: 'Date Product Barcode Status First-Name Last-Name Email Phone-Number Supervisor-First-Name Supervisor-Last-Name Supervisor-Email Supervisor-Phone-Number Title Department Charge-Number Description',
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


module.exports = mongoose.model('History',HistorySchema);