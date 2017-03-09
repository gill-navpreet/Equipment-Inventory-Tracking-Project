angular.module('inventoryCheckOutFormController',[])

.controller('inventoryCheckOutFormCtrl', function(Inventory,$routeParams,$scope,$location) {


	var app = this;

	Inventory.getInventoryBasedOnId($routeParams.id).then(function(data){
		console.log(data);
		app.currentInventory = data.data.inventory._id;
	});

	app.checkOutForm = function(newData){
		var inventoryObject = {};
		inventoryObject._id = app.currentInventory;
		inventoryObject.firstName = $scope.newData.newFirstName;
		inventoryObject.lastName = $scope.newData.newLastName;
		inventoryObject.email = $scope.newData.newEmail;
		inventoryObject.isCheckedIn = 'false';
		inventoryObject.dateCheckedOut = Date.now();

		Inventory.checkOutUpdate(inventoryObject).then(function(data) {
			
		});
		$location.path('/');



	};


});