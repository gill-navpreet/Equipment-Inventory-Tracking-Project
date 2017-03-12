angular.module('inventoryCheckInController',[])

.controller('inventoryCheckInCtrl', function(Inventory, $location,$timeout) {
	app = this;

	app.checkIn = function(barcode){
		if(barcode == null || barcode == ''){
			app.errorMsg = 'Ensure that barcode was entered or space was appended to scanned barcode';
			app.loading = false;
		} else {
			var inventoryObject = {};
			Inventory.getInventoryIdBasedOnBarcode(barcode).then(function(data) {
				if (data.data.success){
					if (data.data.inventory.isCheckedIn == 'false') {
						app.errorMsg = false;
						app.loading = true;
						console.log(data.data.inventory.isCheckedIn);
						inventoryObject._id = data.data.inventory._id;
						inventoryObject.firstName = "n/a";
						inventoryObject.lastName = "n/a";
						inventoryObject.email = "n/a";
						inventoryObject.isCheckedIn = 'true';
						inventoryObject.dateCheckedIn = Date.now();
						Inventory.checkInUpdate(inventoryObject);
						app.successMsg = 'Checking in ....Redirecting';
						$timeout(function(){
							$location.path('/');	
						}, 2000);
					} else {
						app.errorMsg = 'Item is already checked in, please make sure to check out!';
						app.loading = false;
					}
				} else {
					app.errorMsg = data.data.message;
					app.loading = false;
				}
			});	
		}
	};
});