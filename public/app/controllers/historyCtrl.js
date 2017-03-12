angular.module('historyController',['ui.bootstrap'])

.controller('histCtrl', function($scope, $http,History) {
	app = this;
	app.currentPage = 1;
	app.pageSize = 10;
	History.getHistory().then(function(data) {
		console.log(data);
		app.historyData = data.data.history;
	});

})

.filter('pagination', function() {
	return function(data,start) {
		return data.slice(start);
	}
});