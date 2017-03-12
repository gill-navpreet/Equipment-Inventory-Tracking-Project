angular.module('historyServices', [])

.factory('History', function($http){
	historyFactory = {};


	historyFactory.create = function(histData) {
		return $http.post('/api/history', histData);
	};
	historyFactory.getHistory = function() {
		return $http.get('/api/history/');
	};	

	return historyFactory;
});



