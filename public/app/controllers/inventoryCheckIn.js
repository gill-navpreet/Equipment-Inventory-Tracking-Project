angular.module('inventoryCheckInController',[])

.controller('inventoryCheckInCtrl', function(Inventory, $location) {
	app = this;
	app.checkIn = function(barcode){
		Inventory.getInventoryIdBasedOnBarcode(barcode).then(function(data) {
			var inventoryObject = {};
			inventoryObject._id = data.data.inventory._id;
			inventoryObject.firstName = "n/a";
			inventoryObject.lastName = "n/a";
			inventoryObject.email = "n/a";
			inventoryObject.isCheckedIn = 'true';
			Inventory.checkOutUpdate(inventoryObject).then(function(data) {

			});
			$location.path('/');

		});
	};
});

