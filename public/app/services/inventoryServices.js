angular.module('inventoryServices', [])

.factory('Inventory', function($http){
	inventoryFactory = {};


	inventoryFactory.create = function(invData) {
		return $http.post('/api/inventory', invData);
	};

	inventoryFactory.getInventoryForms = function() {
		return $http.get('/api/inventoryManagement/');
	};

	inventoryFactory.getInventory = function(id) {
		return $http.get('/api/editInventory/' + id);
	};	

	inventoryFactory.deleteInventory = function(barcode) {
		return $http.delete('/api/inventoryManagement/' + barcode);
	};

	inventoryFactory.editInventory = function(id) {
		return $http.put('/api/editInventory', id);
	};

	inventoryFactory.getInventoryIdBasedOnBarcode = function(barcode) {
		return $http.get('/api/getInventoryIdBasedOnBarcode/' + barcode);
	};

	inventoryFactory.getInventoryBasedOnId = function(id) {
		return $http.get('/api/getInventoryBasedOnId/' + id);
	};	

	inventoryFactory.checkOutUpdate = function(id) {
		return $http.put('/api/checkOutUpdate', id);
	};

	inventoryFactory.checkInUpdate = function(id) {
		return $http.put('/api/checkInUpdate', id);
	};	



	return inventoryFactory;
});



