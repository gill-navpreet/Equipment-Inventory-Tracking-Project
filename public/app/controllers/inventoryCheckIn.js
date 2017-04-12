angular.module('inventoryCheckInController',[])

.controller('inventoryCheckInCtrl', function(Inventory, $location,$timeout,History) {
	app = this;

	app.checkIn = function(barcode){
		if(barcode == null || barcode == ''){
			app.errorMsg = 'Ensure that barcode was entered or space was appended to scanned barcode';
			app.loading = false;
		} else {
			var inventoryObject = {};
			var historyObject = {};
			Inventory.getInventoryIdBasedOnBarcode(barcode).then(function(data) {
				if (data.data.success){
					if (data.data.inventory.isCheckedIn == 'false') {
						app.errorMsg = false;
						app.loading = true;
						inventoryObject._id = data.data.inventory._id;
						inventoryObject.firstName = " ";
						inventoryObject.lastName = " ";
						inventoryObject.email = " ";
						inventoryObject.phoneNumber = " ";
						inventoryObject.supervisorFirstName = " ";
						inventoryObject.supervisorLastName = " ";
						inventoryObject.supervisorEmail = " ";
						inventoryObject.supervisorPhoneNumber = " ";
						inventoryObject.title = " ";
						inventoryObject.department = " ";
						inventoryObject.location = " ";
						inventoryObject.chargeNumber = " ";
						inventoryObject.isCheckedIn = 'true';
						inventoryObject.dateCheckedIn = Date.now();

						historyObject.firstName = data.data.inventory.firstName;
						historyObject.lastName = data.data.inventory.lastName;
						historyObject.email = data.data.inventory.email;
						historyObject.product = data.data.inventory.product;
						historyObject.barcode = data.data.inventory.barcode;
						historyObject.checkedType = 'checked in';
						historyObject.date = Date.now();
						historyObject.description = historyObject.firstName + " " + historyObject.lastName + " " + historyObject.checkedType + " a " + historyObject.product;

						History.create(historyObject);
						
						Inventory.checkOutUpdate(inventoryObject);
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




