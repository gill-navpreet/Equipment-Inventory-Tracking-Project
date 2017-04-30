angular.module('inventoryCheckInController',[])
// Controller: Controller to update the database when an item is checked in
.controller('inventoryCheckInCtrl', function(Inventory, $location,$timeout,History) {
	app = this;

	app.checkIn = function(barcode){
		if(barcode == null || barcode == ''){ // if barcode is null/empty, return error
			app.errorMsg = 'Ensure that barcode was entered or space was appended to scanned barcode';
			app.loading = false; // Don't start bootstrap loading icon
		} else {
			var inventoryObject = {}; // Create inventoryObject object
			var historyObject = {}; // Create historyObject object
			Inventory.getInventoryIdBasedOnBarcode(barcode).then(function(data) {
				if (data.data.success){
					if (data.data.inventory.isCheckedIn == 'false') { // If the item is currently checked out then proceed to check in of the item
						app.errorMsg = false;// et error message to false
						app.loading = true; // Start bootstrap loading icon
						
						// Update each field of inventory object 
						// Set checked in to true, id to inventory's id, date to the todayy's date
						// Set rest to fields to empty 
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

						// Update each field of history object
						historyObject.firstName = data.data.inventory.firstName;
						historyObject.lastName = data.data.inventory.lastName;
						historyObject.email = data.data.inventory.email;
						historyObject.product = data.data.inventory.product;
						historyObject.barcode = data.data.inventory.barcode;
						historyObject.checkedType = 'checked in';
						historyObject.date = Date.now();
						historyObject.description = historyObject.firstName + " " + historyObject.lastName + " " + historyObject.checkedType + " a " + historyObject.product;
						
						History.create(historyObject);// Create and update history object
						
						Inventory.checkInUpdate(inventoryObject); // Update the inventory in database
						app.successMsg = 'Checking in ....Redirecting'; // Show the redirect message to user

						// Redirect to home page after two thousand milliseconds (2 seconds)
						$timeout(function(){
							$location.path('/');	
						}, 2000);
					} else { // item is already checked in, return error to user
						app.errorMsg = 'Item is already checked in, please make sure to check out!';
						app.loading = false;// Don't start bootstrap loading icon
					}
				} else { // return error to user
					app.errorMsg = data.data.message;
					app.loading = false;// Don't start bootstrap loading icon
				}
			});	
		}
	};
});




