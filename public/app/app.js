//inject all of the modules in the app configuration
angular.module('userApp',['appRoutes','userControllers','userServices','ngAnimate','mainController','authServices','inventoryFormController','userServices','barCodeGeneratorController','historyController','managementController','inventoryManagementController','inventoryCheckInController','inventoryCheckOutController','inventoryCheckOutFormController','historyServices'])

//Used to assign tokens to all of the hhtp requests 
.config(function($httpProvider) {
	//configuring application to intercept all http requests with the AuthInterceptors factory that was created which assigns the tokens to the header.  
	$httpProvider.interceptors.push('AuthInterceptors');
});