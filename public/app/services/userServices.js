angular.module('userServices', [])

.factory('User', function($http){
	userFactory = {}; // Create the userFactory object
	
	// Register users in database
	userFactory.create = function(regData){
		return $http.post('/api/users', regData);
	};

	// Get user permission from database
	userFactory.getPermission = function() {
		return $http.get('/api/permission/');
	};

	// Get all the users from database
	userFactory.getUsers = function() {
		return $http.get('/api/management/');
	};

	// Get the user from database for editing
	userFactory.getUser = function(id) {
		return $http.get('/api/edit/' + id);
	};

	// Delete a user
	userFactory.deleteUser = function(username) {
		return $http.delete('/api/management/' + username);
	};

	// Edit a user
	userFactory.editUser = function(id) {
		return $http.put('/api/edit', id);
	};

	// Return userFactory object
	return userFactory;
});
