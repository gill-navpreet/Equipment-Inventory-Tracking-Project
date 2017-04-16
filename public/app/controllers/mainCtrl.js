angular.module('mainController', ['authServices'])
// name the controller and pass the function
.controller('mainCtrl', function(Auth, User, $timeout, $location, $rootScope) {
	
	var app = this;

	// hide html until loadme is true i.e until we get all of our data like username, email, etc
	// Helps with switching the view on the basis of if the user is logged in or not 
	app.loadme = false;

    // ANytime the route is changed or a page is refreshed, attach the user info to it
	$rootScope.$on('$routeChangeStart', function() {
		if(Auth.isLoggedIn()) {
			app.isLoggedIn = true;
			//app.authorized - false;
			Auth.getUser().then(function(data) { 
				app.username = data.data.username;
				app.useremail = data.data.email;
				// make sure to not show pages for admin or moderator if the user doesn't have those permission
				User.getPermission().then(function(data) {
					if(data.data.permission === 'admin' || data.data.permission === 'moderator'){
						// can use this variable in Index.html file; see Index.html file for usage
						app.authorized = true;
						app.loadme = true;
					} else {
						app.loadme = true;
					}
				});

				app.loadme = true;
			});
		} else {
			app.isLoggedIn = false;
			app.username = '';
			app.loadme = true;
		}
	});


	this.doLogin = function(loginData){
		app.loading = true;
		app.errorMsg = false;

		Auth.login(app.loginData).then(function(data) {
			if(data.data.success){
				app.loading = false;
				//Create Success Message
				app.successMsg = data.data.message +'....Redirecting';
				//Redirect to home page
				$timeout(function(){
					$location.path('/home');
					// Hides the Login option
					app.loginData = {};
					// Hides the success message
					app.successMsg = false;
				}, 2000);
			} else {
				//Create on error message
				app.loading = false;
				app.errorMsg = data.data.message;
			}
		});
	};

	// Steps to do when user presses logout
	this.logout = function() {
		Auth.logout();
		//redirect the user to home page 
		//TODO : remove the logout.html file
		$location.path('/');
	};
});






