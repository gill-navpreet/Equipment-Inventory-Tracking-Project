var mongoose = require('mongoose');
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


module.exports = mongoose.model('History',HistorySchema);