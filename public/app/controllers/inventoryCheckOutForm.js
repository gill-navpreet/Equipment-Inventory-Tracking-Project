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
			inventoryObject.phoneNumber = $scope.newData.newPhoneNumber;
			inventoryObject.title = $scope.newData.newTitle;
			inventoryObject.department = $scope.newData.newDepartment;
			inventoryObject.location = $scope.newData.newLocation;
			inventoryObject.chargeNumber = $scope.newData.newChargeNumber;
			inventoryObject.supervisorFirstName = $scope.newData.newSupervisorFirstName;
			inventoryObject.supervisorLastName = $scope.newData.newSupervisorLastName;
			inventoryObject.supervisorEmail = $scope.newData.newSupervisorEmail;
			inventoryObject.supervisorPhoneNumber = $scope.newData.newSupervisorPhoneNumber;
			inventoryObject.isCheckedIn = 'false';
			inventoryObject.dateCheckedOut = Date.now();

			historyObject.product = product;
			historyObject.barcode = barcode;
			historyObject.checkedType = 'checked out';
			historyObject.firstName = $scope.newData.newFirstName;
			historyObject.lastName =  $scope.newData.newLastName;
			historyObject.email =  $scope.newData.newEmail;
			historyObject.date = Date.now();
			historyObject.phoneNumber =  $scope.newData.newPhoneNumber;
			historyObject.supervisorFirstName =  $scope.newData.newSupervisorFirstName;
			historyObject.supervisorLastName =  $scope.newData.newSupervisorLastName;
			historyObject.supervisorEmail =  $scope.newData.newSupervisorEmail;
			historyObject.supervisorPhoneNumber =  $scope.newData.newSupervisorPhoneNumber;
			historyObject.title =  $scope.newData.newTitle;
			historyObject.department =  $scope.newData.newDepartment;
			historyObject.location =  $scope.newData.newLocation;
			historyObject.chargeNumber =  $scope.newData.newChargeNumber;
			historyObject.description = historyObject.firstName + " " + historyObject.lastName + " " + historyObject.checkedType + " a " + historyObject.product;

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