angular.module('inventoryCheckOutController',[])

.controller('inventoryCheckOutCtrl', function(Inventory, $location, $timeout) {
	app = this;

	//function that takes in the barcode when checking out
	app.checkOut = function(barcode){
		if(barcode == null || barcode == ''){
			app.errorMsg = 'Ensure that barcode was entered or space was appended to scanned barcode';
			app.loading = false;
		} else {	
			//factory performs $http.get('/api/getInventoryIdBasedOnBarcode/' + barcode);
			Inventory.getInventoryIdBasedOnBarcode(barcode).then(function(data) {
				if (data.data.success) {
					if (data.data.inventory.isCheckedIn == 'true'){
						app.errorMsg = false;
						app.loading = true;
						app.successMsg = '....Redirecting';
						$timeout(function() {
							//redirects to the check out form with the _id value based on the barcode and places into the url
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