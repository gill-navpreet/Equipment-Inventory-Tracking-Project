var app = angular.module('appRoutes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {
	$locationProvider.hashPrefix('');
	$routeProvider

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
		authenticated: false
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
		controllerAs: "inventoryForm"
	})

	.when('/history', {
		templateUrl: 'app/views/pages/statistics/history.html',
		controller: 'histCtrl'
	})

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

	.otherwise({ redirectTo: '/'});


});


// Run a check on each route to see if user is logged in or not (depending on if it is specified in the individual route)
app.run(['$rootScope', 'Auth', '$location', 'User' ,function($rootScope, Auth, $location, User) {
	
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
				} else if (next.$$route.permission) {
					User.getPermission().then(function(data) {
						if (next.$$route.permission[0] !== data.data.permission){
							if(next.$$route.permission[1] !== data.data.permission){
								event.preventDefault(); // If not logged in, prevent accessing route
								$location.path('/'); // Redirect to home instead
							}
						}
					});
				}

			} else if (next.$$route.authenticated === false) {
				//If authentication is not required, make sure is not Logged in
				if(Auth.isLoggedIn()){
					event.preventDefault(); // If user is logged in, prevent accessing route
					$location.path('/profile') // Redirect to profile instead
				}
			} 		
		}
	});
}]);

