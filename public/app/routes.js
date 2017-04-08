var app = angular.module('appRoutes', ['ngRoute'])

// Configure Routes

// 'templateUrl' : Provides the html page to show when the route i saccessed
// 'controller' : Defines the name of registered controller for each "view".
// 'controllerAs' : An identifier name for a reference to the controller. If present, the controller will be published to scope under the controllerAs name.
// 'authenticated = true' means the user must be logged in to access the route
// 'permission:' : Defines which users are allowed to visit the page, used to implement management

.config(function($routeProvider, $locationProvider) {
	$locationProvider.hashPrefix('');
	$routeProvider

	// Home Route
	.when('/', {
		templateUrl: 'app/views/pages/home.html'
	})

	.when('/about', {
		templateUrl: 'app/views/pages/about.html'
	})

	.when('/register', {
		templateUrl: 'app/views/pages/users/register.html',
		controller: 'regCtrl',
		controllerAs: 'register',
		authenticated: true,
		permission: ['admin','moderator']
	})
	
	.when('/login', {
		templateUrl: 'app/views/pages/users/login.html',
		authenticated: false
	})
	
	.when('/logout', {
		templateUrl: 'app/views/pages/users/logout.html',
		authenticated: true
	})

	.when('/profile', {
		templateUrl: 'app/views/pages/users/profile.html',
		authenticated: true
	})

	.when('/barCodeGen', {
		templateUrl: 'app/views/pages/tools/barCodeGen.html',
		controller: 'barCodeGenCtrl',
		controllerAs: 'barcodeGenerator',
		authenticated: true
	})

	.when('/inventoryForm', {
		templateUrl: 'app/views/pages/inventory/inventoryForm.html',
		controller: 'invFormCtrl',
		controllerAs: "inventoryForm",
		authenticated: true,
		permission: ['admin','moderator']
	})

	.when('/history', {
		templateUrl: 'app/views/pages/statistics/history.html',
		controller: 'histCtrl',
		controllerAs: 'hist',
		authenticated: true
	})

	// Manage User Accounts
	.when('/management', {
		templateUrl: 'app/views/pages/management/management.html',
		controller: 'managementCtrl',
		controllerAs: 'management',
		authenticated: true,
		permission: ['admin','moderator']
	})

	.when('/edit/:id', {
		templateUrl: 'app/views/pages/management/edit.html',
		controller: 'editCtrl',
		controllerAs: 'edit',
		authenticated: true,
		permission: ['admin','moderator']
	})

	.when('/inventoryManagement', {
		templateUrl: 'app/views/pages/management/inventoryManagement.html',
		controller: 'inventoryManagementCtrl',
		controllerAs: 'inventoryManagement',
		authenticated: true,
		permission: ['admin','moderator']
	})

	.when('/editInventory/:id', {
		templateUrl: 'app/views/pages/management/editInventory.html',
		controller: 'editInventoryCtrl',
		controllerAs: 'editInventory',
		authenticated: true,
		permission: ['admin','moderator']
	})

	.when('/inventoryCheckOut', {
		templateUrl: 'app/views/pages/inventory/inventoryCheckOut.html',
		controller: 'inventoryCheckOutCtrl',
		controllerAs: 'checkOut',
		authenticated: true
	})

	.when('/inventoryCheckIn', {
		templateUrl: 'app/views/pages/inventory/inventoryCheckIn.html',
		controller: 'inventoryCheckInCtrl',
		controllerAs: 'checkIn',
		authenticated: true
	})	

	.when('/checkOutForm/:id', {
		templateUrl: 'app/views/pages/inventory/inventoryCheckOutForm.html',
		controller: 'inventoryCheckOutFormCtrl',
		controllerAs: 'checkOutForm',
		authenticated: true
	})

	.when('/search', {
		templateUrl: 'app/views/pages/statistics/search.html',
		controller: 'histCtrl',
		controllerAs: 'hist',
		authenticated: true
	})

	// If user tries to access any other route --> redirect to home page
	.otherwise({ redirectTo: '/'});


});


// Run a check on each route to see if user is logged in or not (depending on if it is specified in the individual route)
app.run(['$rootScope', 'Auth', '$location', 'User',function($rootScope, Auth, $location, User) {
	
	// Check each time route changes
	$rootScope.$on('$routeChangeStart', function(event, next, current) {
		
		// Only perform if user visited a route listed above
		if(next.$$route !== undefined){
			
			// Check if authentication is required on route
			if(next.$$route.authenticated === true) {
				
				// If authentication is required, make sure user is logged in
				if(!Auth.isLoggedIn()){
					event.preventDefault(); // If not logged in, prevent accessing route
					$location.path('/'); // Redirect to home instead
				} else if (next.$$route.permission) { // if the permission is present in the route
					User.getPermission().then(function(data) {
						// If the user doesn't have oth index i.e admin permission or 1st index which is moderator permission
						// then prevent the user from accessing that page
						if (next.$$route.permission[0] !== data.data.permission){
							if(next.$$route.permission[1] !== data.data.permission){
								event.preventDefault(); // If not logged in, prevent accessing route
								$location.path('/'); // Redirect to home instead
							}
						}
					});
				}

			} else if (next.$$route.authenticated === false) { //If authentication is not required, make sure is not Logged in
				if(Auth.isLoggedIn()){
					event.preventDefault(); // If user is logged in, prevent accessing route
					$location.path('/profile') // Redirect to profile instead
				}
			} 		
		}
	});
}]);

