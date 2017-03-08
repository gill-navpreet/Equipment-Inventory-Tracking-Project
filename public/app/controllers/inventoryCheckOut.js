angular.module('inventoryCheckOutController',[])

.controller('inventoryCheckOutCtrl', function($scope,Inventory,$routeParams) {
	app = this;

	Inventory.findOne({ barcode: 387648267}), function(err,inventory) {
		console.log(inventory.barcode);
	}

	app.checkOut = function(checkOutData) {





	}
});