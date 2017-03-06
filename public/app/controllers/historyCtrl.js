angular.module('historyController',['ui.bootstrap'])

.controller('histCtrl', function($scope, $http) {
	$scope.currentPage = 1;
	$scope.pageSize = 10;
	$http.get('/api/inventory').then(function(data) {
		$scope.inventoryData = data.data.inventoryforms;
	});

})

.filter('pagination', function() {
	return function(data,start) {
		return data.slice(start);
	}
});