angular.module('barCodeGeneratorController',[])

.controller('barCodeGenCtrl', function($scope){

	this.generate = function(){

		JsBarcode("#barcode",Math.floor(1000000000 + Math.random() * 8999999999));
	};
});

