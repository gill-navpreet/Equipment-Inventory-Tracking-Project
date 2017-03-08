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


	return inventoryFactory;
});



