angular.module('barCodeGeneratorController',[])

.controller('barCodeGenCtrl', function($scope){

	this.generate = function(){

		JsBarcode("#barcode",Math.floor(Math.random() * 10000000000));
	};
});

