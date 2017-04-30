angular.module('inventoryServices', [])

.factory('Inventory', function($http){
	inventoryFactory = {}; // Create the inventoryFactory object

	// Creates inventory using inventory data like name, email phone number, and so on in database
	inventoryFactory.create = function(invData) {
		return $http.post('/api/inventory', invData);
	};
	// Retrive the inventory from database 
	inventoryFactory.getInventoryForms = function() {
		return $http.get('/api/inventoryManagement/');
	};
	//Get the inventory from database for editing based on id
	inventoryFactory.getInventory = function(id) {
		return $http.get('/api/editInventory/' + id);
	};	
	// Delete the inventory from database based on the barcode
	inventoryFactory.deleteInventory = function(barcode) {
		return $http.put('/api/inventoryManagement/' + barcode);
	};
	// Post the edited inventory to database
	inventoryFactory.editInventory = function(id) {
		return $http.put('/api/editInventory', id);
	};
	// Retrive the inventory from database based on the barcode
	inventoryFactory.getInventoryIdBasedOnBarcode = function(barcode) {
		return $http.get('/api/getInventoryIdBasedOnBarcode/' + barcode);
	};
	// Retrive the inventory from database based on the id from URL
	inventoryFactory.getInventoryBasedOnId = function(id) {
		return $http.get('/api/getInventoryBasedOnId/' + id);
	};	
	// Post the check out update data to database
	inventoryFactory.checkOutUpdate = function(id) {
		return $http.put('/api/checkOutUpdate', id);
	};
	// Post the check in update data to database
	inventoryFactory.checkInUpdate = function(id) {
		return $http.put('/api/checkInUpdate', id);
	};	

	// Return inventoryFactory object
	return inventoryFactory;
});



