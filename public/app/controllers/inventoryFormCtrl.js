angular.module('inventoryFormController',['inventoryServices'])

.controller('invFormCtrl', function($http,$location,$timeout,Inventory,$scope,History) {

	var app = this;
	
	this.logInventory = function(invData) {
		app.loading = true;
		app.errorMsg = false;

		Inventory.create(app.invData).then(function(data) {
			if(data.data.success){
				var historyObject = {};
				app.loading = false;
				// Create Success Message
				app.successMsg = data.data.message + '...Redirecting';



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


