angular.module('inventoryCheckOutController',[])

.controller('inventoryCheckOutCtrl', function(Inventory) {
	app = this;



	app.checkOut = function(barcode){
		
		console.log(barcode);
	};
});