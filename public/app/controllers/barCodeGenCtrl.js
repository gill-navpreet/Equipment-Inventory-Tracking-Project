angular.module('barCodeGeneratorController',[])

.controller('barCodeGenCtrl', function(){
	this.generate = function(bcode){
		JsBarcode("#barcode",this.bcode);
	};
});

