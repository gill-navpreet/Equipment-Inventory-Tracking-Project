angular.module('inventoryFormController',['inventoryServices'])
// Controller for creating new inventory
.controller('invFormCtrl', function($http,$location,$timeout,Inventory,$scope,History) {

	var app = this;
	
	//Function that uses the data from a new inventory item and creates it in the database
	this.logInventory = function(invData) {
		app.loading = true;
		app.errorMsg = false;
		// Factory that takes the information of requested new inventory item and uses $http.post('/api/inventory', invData);
		Inventory.create(app.invData).then(function(data) {
			if(data.data.success){
				// Creation of history object to be used.
				var historyObject = {};
				app.loading = false;
				// Create Success Message
				app.successMsg = data.data.message + '...Redirecting';


				// History objects to create a log of creations of data.
				historyObject.product = app.invData.product;
				historyObject.barcode = app.invData.barcode;
				historyObject.checkedType = 'created';
				historyObject.date = Date.now();
				historyObject.description = historyObject.checkedType + " a " + historyObject.product + " with barcode: " + historyObject.barcode;
				console.log(historyObject);
				History.create(historyObject);
				// Redirect to home pages
				$timeout(function(){
					$location.path('/inventoryManagement');
				}, 2000);
			} else {
				// Create an error message
				app.loading = false;
				app.errorMsg = data.data.message;
			}
		});
	};
});


