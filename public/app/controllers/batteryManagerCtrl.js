angular.module('batteryManagerController',[])

.controller('batteryManagerCtrl', function(Inventory) {
	var app = this;
	Inventory.getInventoryForms().then(function(data) {
		app.inventoryforms = data.data.inventoryforms;
	});
});