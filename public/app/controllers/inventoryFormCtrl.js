angular.module('inventoryFormController',['inventoryServices'])

.controller('invFormCtrl', function($http,$location,$timeout,Inventory) {

	var app = this;
	
	this.logInventory = function(invData) {
		app.loading = true;
		app.errorMsg = false;

		Inventory.create(app.invData).then(function(data) {
			if(data.data.success){
				app.loading = false;
				// Create Success Message
				app.successMsg = data.data.message + '...Redirecting';
				// Redirect to home pages
				$timeout(function(){
					$location.path('/');
				}, 2000);
			} else {
				// Create an error message
				app.loading = false;
				app.errorMsg = data.data.message;
			}
		});
	};
});


