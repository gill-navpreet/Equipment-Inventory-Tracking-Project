angular.module('userApp',['appRoutes','userControllers','userServices','ngAnimate','mainController','authServices','inventoryFormController','userServices','barCodeGeneratorController','historyController','managementController','inventoryManagementController','inventoryCheckInController','inventoryCheckOutController','inventoryCheckOutFormController','historyServices'])

.config(function($httpProvider) {
	//configuring application to intercept all http requests with the AuthInterceptors factory that was created which assigns the tokens to the header.  
	$httpProvider.interceptors.push('AuthInterceptors');
});