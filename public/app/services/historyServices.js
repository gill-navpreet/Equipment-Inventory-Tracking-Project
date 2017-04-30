angular.module('historyServices', [])

.factory('History', function($http){
	historyFactory = {}; // Create the historyFactory object
	
	// Create history in database
	historyFactory.create = function(histData) {
		return $http.post('/api/history', histData);
	};
	// Get history from database
	historyFactory.getHistory = function() {
		return $http.get('/api/history/');
	};	
	// return historyFactory object
	return historyFactory;
});



