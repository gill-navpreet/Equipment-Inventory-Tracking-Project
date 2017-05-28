angular.module('historyController',['ui.bootstrap'])

.controller('histCtrl', function($scope, $http,History) {
	app = this;
	app.currentPage = 1;
	app.pageSize = 10;
	app.searchLimit = 0;

	History.getHistory().then(function(data) {
		console.log(data);
		app.historyData = data.data.history;
	});
    // Function: Show more results on page
    app.showMore = function(number) {
        app.showMoreError = false; // Clear error message
        // Run functio only if a valid number above zero
        if (number > 0) {
            app.pageSize = number; // Change ng-repeat filter to number requested by user
        } else {
            app.showMoreError = 'Please enter a valid number'; // Return error if number not valid
        }
    };

    // Function: Show all results on page
    app.showAll = function() {
        app.pageSize = undefined; // Clear ng-repeat limit
        app.showMoreError = false; // Clear error message
    };

	app.search = function(searchKeyword, number) {
		if(searchKeyword) {
			if(searchKeyword.length > 0) {
				app.pageSize = 0;
				$scope.searchFilter = searchKeyword;
				app.pageSize = number;

			} else {
				$scope.searchFilter = undefined;
				app.pageSize = 0;
			}
		} else {
			$scope.searchFilter = undefined;
			app.pageSize = 0;
		}
	};

	app.clear = function() {
		$scope.number = 'Clear';
		app.pageSize = 0;
		$scope.searchKeyword = undefined;
		$scope.searchFilter = undefined;
		app.showMoreError = false;
	};


	app.advancedSearch = function(searchByFirstName, searchByLastName, searchByEmail, searchByDepartment, searchByProduct, searchByBarcode) {
		if (searchByFirstName || searchByLastName || searchByEmail || searchByDepartment || searchByProduct || searchByBarcode) {
			$scope.advancedSearchFilter = {};
			if (searchByFirstName) {
				$scope.advancedSearchFilter.firstName = searchByFirstName;
			}
			if (searchByLastName) {
				$scope.advancedSearchFilter.lastName = searchByLastName;
			}
			if (searchByEmail) {
				$scope.advancedSearchFilter.email = searchByEmail;
			}
			if (searchByDepartment) {
				$scope.advancedSearchFilter.department = searchByDepartment;
			}
			if (searchByProduct) {
				$scope.advancedSearchFilter.product = searchByProduct;
			}
			if (searchByBarcode) {
				console.log(searchByBarcode);
				$scope.advancedSearchFilter.barcode = searchByBarcode;
			}
			app.searchLimit = undefined;
		}
	};

	app.sortOrder = function(order) {
		app.sort = order;
	};


    $scope.from = new Date();
    $scope.from.setMonth($scope.from.getMonth()-1);
    $scope.to = new Date();    

    

})

.filter('pagination', function() {
	return function(data,start) {
		return data.slice(start);
	}
});