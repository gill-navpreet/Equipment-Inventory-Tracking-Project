angular.module('batteryManagerController',[])

// Controller: Battery manager controller
.controller('batteryManagerCtrl', function(Inventory) {
	var app = this;
	Inventory.getInventoryForms().then(function(data) {
		app.inventoryforms = data.data.inventoryforms;
	});
});