//AngularJS module defines an application
//Can add controllers, directives, filters, and more things that you would like to your AngularJS application
angular.module('userApp',['appRoutes','userControllers','userServices','ngAnimate','mainController','authServices','inventoryFormController',
	'userServices','barCodeGeneratorController','historyController','managementController','inventoryManagementController','inventoryCheckInController',
	'inventoryCheckOutController','inventoryCheckOutFormController','historyServices','batteryManagerController','graphController'])

.config(function($httpProvider) {
	//configuring application to intercept all http requests with the AuthInterceptors factory that was created which assigns the tokens to the header.  
	$httpProvider.interceptors.push('AuthInterceptors');
})



// This directive allows the keyword 'focus' to trigger a focus into an input field. Primarily used on barcode input field.
// source: http://stackoverflow.com/questions/14833326/how-to-set-focus-on-input-field
.directive('focus', function($timeout) {
 return {
 scope : {
   trigger : '@focus'
 },
 link : function(scope, element) {
  scope.$watch('trigger', function(value) {
    if (value === "true") {
      $timeout(function() {
       element[0].focus();
      });
   }
 });
 }
};
});