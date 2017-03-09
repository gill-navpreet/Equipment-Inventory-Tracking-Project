angular.module('inventoryCheckOutController',[])

.controller('inventoryCheckOutCtrl', function(Inventory, $location) {
	app = this;



	app.checkOut = function(barcode){
		Inventory.getInventoryIdBasedOnBarcode(barcode).then(function(data) {
			console.log(data.data.inventory._id);
			$location.path('/checkOutForm/' + data.data.inventory._id);
		});
	};
});