angular.module('userControllers',['userServices'])

.controller('regCtrl', function($http,$location, $timeout,User){

	var app = this;

	this.regUser = function(regData, valid){
		app.loading = true;
		app.errorMsg = false;

		if(valid){ // Form is fille dout completely, go to database for further validation
			User.create(app.regData).then(function(data) {
			if(data.data.success){
				app.loading = false;
				//Create Success Message
				app.successMsg = data.data.message +'....Redirecting';
				//Redirect to home page
				$timeout(function(){
					$location.path('/');
				}, 2000);
			} else {
				app.loading = false;
				//Create on error message
				app.errorMsg = data.data.message;
			}
		});
		}else{ // form is not filled out, prevent accessing the back end/ database
			app.loading = false;
			//Create on error message
			app.errorMsg = "Please ensure form is filled out completely";
		}
		
	};
});


