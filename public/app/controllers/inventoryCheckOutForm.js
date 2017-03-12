angular.module('inventoryCheckOutFormController',[])

.controller('inventoryCheckOutFormCtrl', function(Inventory,$routeParams,$scope,$location,$timeout) {


	var app = this;

	Inventory.getInventoryBasedOnId($routeParams.id).then(function(data){
		app.currentInventory = data.data.inventory._id;
	});

	app.checkOutForm = function(newData){
		if($scope.newData.newFirstName == null || $scope.newData.newFirstName == '' || $scope.newData.newLastName == null || $scope.newData.newLastName == ''  || $scope.newData.newEmail == null || $scope.newData.newEmail == ''){
			
		} else {	
			var inventoryObject = {};
			inventoryObject._id = app.currentInventory;
			inventoryObject.firstName = $scope.newData.newFirstName;
			inventoryObject.lastName = $scope.newData.newLastName;
			inventoryObject.email = $scope.newData.newEmail;
			inventoryObject.isCheckedIn = 'false';
			inventoryObject.dateCheckedOut = Date.now();
			Inventory.checkOutUpdate(inventoryObject);
			app.errorMsg = false;
			app.loading = true;
			app.successMsg = 'Checking out ....Redirecting';
			$timeout(function(){
				$location.path('/');
			}, 2000);
		}	
	};


});