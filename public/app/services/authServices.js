angular.module('authServices',[])

// the following factory is going to be created for user authentication e.g. logging in, out etc.
.factory('Auth', function($http, AuthToken){ // NOTE: Pass in AuthToken because we are referencing it in this factory
	var authFactory = {};
	
	// Auth.login(loginData);
	// Sets the token and return data
	authFactory.login = function(loginData){
		return $http.post('/api/authenticate', loginData).then(function(data) {
			// Set the token in the browser
			AuthToken.setToken(data.data.token);
			return data;
		});
	};

	// Auth.isLoggedIn();
	// Function to check if the user is logged in 
	// Check to see if we can get the token from user's local sotage
	// If we get it --> user logged in
	// else --> user is not logged in
	authFactory.isLoggedIn = function(){
		if(AuthToken.getToken()) {
			return true;
		} else {
			return false;
		}
	};

	// Auth.getUser();
	// Validates token and get the user info
	authFactory.getUser = function() {
		if(AuthToken.getToken()) {
			return $http.post('api/me');
		} else {
			// reject the request
			$q.reject({ message: 'User has no token' });
		}
	};

	// Auth.logout();
	// Removes the token from user's local storage
	// by calling setToken with no parms
	authFactory.logout = function() {
		AuthToken.setToken();
	};

	return authFactory; // Return factory object
})

// Factory for jwt
.factory('AuthToken', function($window) {
	var authTokenFactory = {};

	// AuthToken.setToken(token);
	// function for setting the token
	authTokenFactory.setToken = function(token) {
		if(token) {
			// if token is provided, save the token in user's local storage
			$window.localStorage.setItem('token', token);
		} else {
			// else remove the token
			// Used for logout to clear the token
			$window.localStorage.removeItem('token');
		}
	};


	//AuthToken.getToken();
	// function to get the token from user's local storage which was set by the above function
	authTokenFactory.getToken = function(){
		return $window.localStorage.getItem('token');
	};

	return authTokenFactory; // Return factory object
})


// Factory to attach tokens to every request
// Used to configure headers with token (passed into config, app.js file)
.factory('AuthInterceptors', function(AuthToken) {
	var authInterceptorsFactory = {}; // Create factory object

	// Function to check for token in local storage and attach to header 
	authInterceptorsFactory.request = function(config) {	
		var token = AuthToken.getToken();// Check if a token is in local storage
		if(token) config.headers['x-access-token'] = token; //If exists, attach to headers
		return config;// Return config object for use in app.js (config file)
	};
	return authInterceptorsFactory;// Return factory object
});