angular.module('inventoryManagementController', [])

.controller('inventoryManagementCtrl', function(Inventory) {
	var app = this;

	app.loading = true;
	app.accessDenied = true;
	app.errorMsg = false;
	app.editAccess = false;
	app.deleteAccess = false;

	Inventory.getInventoryForms().then(function(data) {
		if(data.data.success) {
			if(data.data.permission === 'admin' || data.data.permission === 'moderator') {
				app.inventoryforms = data.data.inventoryforms;
				app.loading = false
				app.accessDenied = false;
				if(data.data.permission === 'admin') {
					app.editAccess = true;
					app.deleteAccess = true;
				} else if(data.data.permission === 'moderator') {
					app.editAccess = true;
				}
			} else {
				app.errorMsg = 'Insufficient Permissions';
				app.loading = false;
			}
		} else {
			app.errorMsg = data.data.message;
			app.loading = false;	
		}
	});
});