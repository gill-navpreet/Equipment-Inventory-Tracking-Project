var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var HistorySchema = new Schema({
	firstName: { type: String, lowercase: true, default: ' '},
	lastName: { type: String, lowercase: true, default: ' ' },
	email: {type: String, lowercase: true, default: ' ' },
	product: { type: String, lowercase: true, required: true, default: ' ' },
	barcode: { type: Number, required: true},
	checkedType: { type: String, required: true, default: ' '},
	date: { type: Date, required: true, default: Date},
	description: { type: String, default: 'description'}

});


module.exports = mongoose.model('History',HistorySchema);