angular.module('inventoryCheckOutFormController',[])

.controller('inventoryCheckOutFormCtrl', function(Inventory,History,$routeParams,$scope,$location,$timeout) {


	var app = this;
	var product = '';
	var barcode = '';
	Inventory.getInventoryBasedOnId($routeParams.id).then(function(data){
		app.currentInventory = data.data.inventory._id;
		product = data.data.inventory.product;
		barcode = data.data.inventory.barcode;
	});

	app.checkOutForm = function(newData){
		if($scope.newData.newFirstName == null || $scope.newData.newFirstName == '' || $scope.newData.newLastName == null || $scope.newData.newLastName == ''  || $scope.newData.newEmail == null || $scope.newData.newEmail == ''){
			
		} else {	
			var inventoryObject = {};
			var historyObject = {};
			inventoryObject._id = app.currentInventory;
			inventoryObject.firstName = $scope.newData.newFirstName;
			inventoryObject.lastName = $scope.newData.newLastName;
			inventoryObject.email = $scope.newData.newEmail;
			inventoryObject.isCheckedIn = 'false';
			inventoryObject.dateCheckedOut = Date.now();


			historyObject.firstName = $scope.newData.newFirstName;
			historyObject.lastName =  $scope.newData.newLastName;
			historyObject.email =  $scope.newData.newEmail;
			historyObject.product = product;
			historyObject.barcode = barcode;
			historyObject.checkedType = 'checked out';
			historyObject.date = Date.now();
			historyObject.description = historyObject.firstName + " " + historyObject.lastName + " " + historyObject.checkedType + " a " + historyObject.product;
			console.log(historyObject);
			History.create(historyObject);


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