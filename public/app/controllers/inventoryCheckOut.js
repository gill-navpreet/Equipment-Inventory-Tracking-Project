angular.module('inventoryCheckOutController',[])

.controller('inventoryCheckOutCtrl', function(Inventory, $location, $timeout) {
	app = this;


	app.checkOut = function(barcode){
		if(barcode == null || barcode == ''){
			app.errorMsg = 'Ensure that barcode was entered or space was appended to scanned barcode';
			app.loading = false;
		} else {	
			Inventory.getInventoryIdBasedOnBarcode(barcode).then(function(data) {
				if (data.data.success) {
					if (data.data.inventory.isCheckedIn == 'true'){
						app.errorMsg = false;
						app.loading = true;
						app.successMsg = '....Redirecting';
						$timeout(function() {
							$location.path('/checkOutForm/' + data.data.inventory._id);
						}, 2000);
					} else {
						app.errorMsg = 'Item is already checked out, please make sure to check in!';
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