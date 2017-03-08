angular.module('inventoryServices', [])

.factory('Inventory', function($http){
	inventoryFactory = {};


	inventoryFactory.create = function(invData) {
		return $http.post('/api/inventory', invData);
	}

	inventoryFactory.getInventoryForms = function() {
		return $http.get('/api/inventoryManagement/');
	}

	return inventoryFactory;
});



