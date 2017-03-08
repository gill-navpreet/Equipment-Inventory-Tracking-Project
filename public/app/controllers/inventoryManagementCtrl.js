angular.module('inventoryManagementController', ['ui.bootstrap'])

.controller('inventoryManagementCtrl', function(Inventory) {
	var app = this;
	app.currentPage = 1;
	app.pageSize = 10;
	app.loading = true;
	app.accessDenied = true;
	app.errorMsg = false;
	app.editAccess = false;
	app.deleteAccess = false;

	function getInventory() {
		Inventory.getInventoryForms().then(function(data) {
			if(data.data.success) {
				if(data.data.permission === 'admin' || data.data.permission === 'moderator') {
					app.inventoryforms = data.data.inventoryforms;
					app.loading = false
					app.accessDenied = false;
					if(data.data.permission === 'admin') {
						app.editAccess = true;
						app.deleteAccess = true;
					} else if(data.data.permission === 'moderator') {
						app.editAccess = true;
					}
				} else {
					app.errorMsg = 'Insufficient Permissions';
					app.loading = false;
				}
			} else {
				app.errorMsg = data.data.message;
				app.loading = false;	
			}
		});
	}

	getInventory();

	app.showMore = function(number) {
		app.showMoreError = false;
		if(number > 0) {
			app.pageSize = number;
		} else {
			app.showMoreError = 'Please enter a valid number';
		}

	};

	app.showAll = function() {
		app.pageSize = undefined;
		app.showMoreError = false;
	};

	app.deleteInventory = function(barcode) {
		Inventory.deleteInventory(barcode).then(function(data) {
			if(data.data.success) {
				getInventory();
			} else {
				app.showMoreError = data.data.message;
			}
		})
	};

})




.filter('pagination', function() {
	return function(data,start) {
		if(!data || !data.length) { return; }
		start = +start;
		return data.slice(start);
	}
})



.controller('editInventoryCtrl', function($scope, $routeParams,User, Inventory, $timeout) {
	var app = this;
	$scope.firstNameTab = 'active';
	app.phase1 = true;

	Inventory.getInventory($routeParams.id).then(function(data) {
		if(data.data.success) {
			$scope.newFirstName = data.data.inventory.firstName;
			$scope.newLastName = data.data.inventory.lastName;
			$scope.newEmail = data.data.inventory.email;
			$scope.newProduct = data.data.inventory.product;
			$scope.newBarcode = data.data.inventory.barcode;
			$scope.newIsCheckedIn = data.data.inventory.isCheckedIn;
			app.currentInventory = data.data.inventory._id;

		} else {
			app.errorMsg = data.data.message;
		}
	});

	app.firstNamePhase = function() {
		$scope.firstNameTab = 'active';
		$scope.lastNameTab = 'default';
		$scope.emailTab = 'default';
		$scope.productTab = 'default';
		$scope.barcodeTab = 'default';
		$scope.isCheckedInTab = 'default';
		app.phase1 = true;
		app.phase2 = false;
		app.phase3 = false;
		app.phase4 = false;
		app.phase5 = false;
		app.phase6 = false;
		app.errorMsg = false;

	};

	app.lastNamePhase = function() {
		$scope.firstNameTab = 'default';
		$scope.lastNameTab = 'active';
		$scope.emailTab = 'default';
		$scope.productTab = 'default';
		$scope.barcodeTab = 'default';
		$scope.isCheckedInTab = 'default';
		app.phase1 = false;
		app.phase2 = true;
		app.phase3 = false;
		app.phase4 = false;
		app.phase5 = false;
		app.phase6 = false;
		app.errorMsg = false;
	};

	app.emailPhase = function() {
		$scope.firstNameTab = 'default';
		$scope.lastNameTab = 'default';
		$scope.emailTab = 'active';
		$scope.productTab = 'default';
		$scope.barcodeTab = 'default';
		$scope.isCheckedInTab = 'default';
		app.phase1 = false;
		app.phase2 = false;
		app.phase3 = true;
		app.phase4 = false;
		app.phase5 = false;
		app.phase6 = false;
		app.errorMsg = false;
	};

	app.productPhase = function() {
		$scope.firstNameTab = 'default';
		$scope.lastNameTab = 'default';
		$scope.emailTab = 'default';
		$scope.productTab = 'active';
		$scope.barcodeTab = 'default';
		$scope.isCheckedInTab = 'default';
		app.phase1 = false;
		app.phase2 = false;
		app.phase3 = false;
		app.phase4 = true;
		app.phase5 = false;
		app.phase6 = false;
		app.errorMsg = false;
	};

	app.barcodePhase = function() {
		$scope.firstNameTab = 'default';
		$scope.lastNameTab = 'default';
		$scope.emailTab = 'default';
		$scope.productTab = 'default';
		$scope.barcodeTab = 'active';
		$scope.isCheckedInTab = 'default';
		app.phase1 = false;
		app.phase2 = false;
		app.phase3 = false;
		app.phase4 = false;
		app.phase5 = true;
		app.phase6 = false;
		app.errorMsg = false;
	};

	app.isCheckedInPhase = function() {
		$scope.firstNameTab = 'default';
		$scope.lastNameTab = 'default';
		$scope.emailTab = 'default';
		$scope.productTab = 'default';
		$scope.barcodeTab = 'default';
		$scope.isCheckedInTab = 'active';
		app.phase1 = false;
		app.phase2 = false;
		app.phase3 = false;
		app.phase4 = false;
		app.phase5 = false;
		app.phase6 = true;
		app.errorMsg = false;
	};

    // Function: Update the user's name
    app.updateFirstName = function(newFirstName) {
        app.errorMsg = false; // Clear any error messages
        app.disabled = true; // Disable form while processing
        // Check if the name being submitted is valid
 
            var inventoryObject = {}; // Create a user object to pass to function
            inventoryObject._id = app.currentInventory; // Get _id to search database
            inventoryObject.firstName = $scope.newFirstName; // Set the new name to the user
            // Runs function to update the user's name
            Inventory.editInventory(inventoryObject).then(function(data) {
                // Check if able to edit the user's name
                if (data.data.success) {
                    app.successMsg = data.data.message; // Set success message
                    // Function: After two seconds, clear and re-enable
                    $timeout(function() {
                        app.firstNameForm.firstName.$setPristine(); // Reset name form
                        app.firstNameForm.firstName.$setUntouched(); // Reset name form
                        app.successMsg = false; // Clear success message
                        app.disabled = false; // Enable form for editing
                    }, 2000);
                } else {
                    app.errorMsg = data.data.message; // Clear any error messages
                    app.disabled = false; // Enable form for editing
                }
            });
       
    };

    app.updateLastName = function(newLastName) {
        app.errorMsg = false; // Clear any error messages
        app.disabled = true; // Disable form while processing
        // Check if the name being submitted is valid
 
            var inventoryObject = {}; // Create a user object to pass to function
            inventoryObject._id = app.currentInventory; // Get _id to search database
            inventoryObject.lastName = $scope.newLastName; // Set the new name to the user
            // Runs function to update the user's name
            Inventory.editInventory(inventoryObject).then(function(data) {
                // Check if able to edit the user's name
                if (data.data.success) {
                    app.successMsg = data.data.message; // Set success message
                    // Function: After two seconds, clear and re-enable
                    $timeout(function() {
                        app.lastNameForm.lastName.$setPristine(); // Reset name form
                        app.lastNameForm.lastName.$setUntouched(); // Reset name form
                        app.successMsg = false; // Clear success message
                        app.disabled = false; // Enable form for editing
                    }, 2000);
                } else {
                    app.errorMsg = data.data.message; // Clear any error messages
                    app.disabled = false; // Enable form for editing
                }
            });
       
    };

    app.updateEmail = function(newEmail) {
        app.errorMsg = false; // Clear any error messages
        app.disabled = true; // Disable form while processing
        // Check if the name being submitted is valid
 
            var inventoryObject = {}; // Create a user object to pass to function
            inventoryObject._id = app.currentInventory; // Get _id to search database
            inventoryObject.email = $scope.newEmail; // Set the new name to the user
            // Runs function to update the user's name
            Inventory.editInventory(inventoryObject).then(function(data) {
                // Check if able to edit the user's name
                if (data.data.success) {
                    app.successMsg = data.data.message; // Set success message
                    // Function: After two seconds, clear and re-enable
                    $timeout(function() {
                        app.emailForm.email.$setPristine(); // Reset name form
                        app.emailForm.email.$setUntouched(); // Reset name form
                        app.successMsg = false; // Clear success message
                        app.disabled = false; // Enable form for editing
                    }, 2000);
                } else {
                    app.errorMsg = data.data.message; // Clear any error messages
                    app.disabled = false; // Enable form for editing
                }
            });
       
    };

    app.updateProduct = function(newProduct) {
        app.errorMsg = false; // Clear any error messages
        app.disabled = true; // Disable form while processing
        // Check if the name being submitted is valid
 
            var inventoryObject = {}; // Create a user object to pass to function
            inventoryObject._id = app.currentInventory; // Get _id to search database
            inventoryObject.product = $scope.newProduct; // Set the new name to the user
            // Runs function to update the user's name
            Inventory.editInventory(inventoryObject).then(function(data) {
                // Check if able to edit the user's name
                if (data.data.success) {
                    app.successMsg = data.data.message; // Set success message
                    // Function: After two seconds, clear and re-enable
                    $timeout(function() {
                        app.productForm.product.$setPristine(); // Reset name form
                        app.productForm.product.$setUntouched(); // Reset name form
                        app.successMsg = false; // Clear success message
                        app.disabled = false; // Enable form for editing
                    }, 2000);
                } else {
                    app.errorMsg = data.data.message; // Clear any error messages
                    app.disabled = false; // Enable form for editing
                }
            });
       
    };


    app.updateBarcode = function(newBarcode) {
        app.errorMsg = false; // Clear any error messages
        app.disabled = true; // Disable form while processing
        // Check if the name being submitted is valid
 
            var inventoryObject = {}; // Create a user object to pass to function
            inventoryObject._id = app.currentInventory; // Get _id to search database
            inventoryObject.barcode = $scope.newBarcode; // Set the new name to the user
            // Runs function to update the user's name
            Inventory.editInventory(inventoryObject).then(function(data) {
                // Check if able to edit the user's name
                if (data.data.success) {
                    app.successMsg = data.data.message; // Set success message
                    // Function: After two seconds, clear and re-enable
                    $timeout(function() {
                        app.barcodeForm.barcode.$setPristine(); // Reset name form
                        app.barcodeForm.barcode.$setUntouched(); // Reset name form
                        app.successMsg = false; // Clear success message
                        app.disabled = false; // Enable form for editing
                    }, 2000);
                } else {
                    app.errorMsg = data.data.message; // Clear any error messages
                    app.disabled = false; // Enable form for editing
                }
            });
       
    };


    app.updateIsCheckedIn = function(newIsCheckedIn) {
        app.errorMsg = false; // Clear any error messages
        app.disabled = true; // Disable form while processing
        // Check if the name being submitted is valid
 
            var inventoryObject = {}; // Create a user object to pass to function
            inventoryObject._id = app.currentInventory; // Get _id to search database
            inventoryObject.isCheckedIn = $scope.newIsCheckedIn; // Set the new name to the user
            // Runs function to update the user's name
            Inventory.editInventory(inventoryObject).then(function(data) {
                // Check if able to edit the user's name
                if (data.data.success) {
                    app.successMsg = data.data.message; // Set success message
                    // Function: After two seconds, clear and re-enable
                    $timeout(function() {
                        app.isCheckedInForm.isCheckedIn.$setPristine(); // Reset name form
                        app.isCheckedInForm.isCheckedIn.$setUntouched(); // Reset name form
                        app.successMsg = false; // Clear success message
                        app.disabled = false; // Enable form for editing
                    }, 2000);
                } else {
                    app.errorMsg = data.data.message; // Clear any error messages
                    app.disabled = false; // Enable form for editing
                }
            });
       
    };



});