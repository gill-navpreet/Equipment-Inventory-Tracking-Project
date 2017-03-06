angular.module('inventoryServices', [])

.factory('Inventory', function($http){
	inventoryFactory = {};


	inventoryFactory.create = function(invData) {
		return $http.post('/api/inventory', invData);
	}

	return inventoryFactory;
});



