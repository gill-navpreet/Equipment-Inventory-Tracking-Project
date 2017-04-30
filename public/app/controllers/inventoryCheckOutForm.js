angular.module('inventoryCheckOutFormController',[])

.controller('inventoryCheckOutFormCtrl', function(Inventory,History,$routeParams,$scope,$location,$timeout) {


	var app = this;
	var product = '';
	var barcode = '';
	// List of departments from UCD website
	$scope.departments = [
	'African American and African Studies',
	'Agricultural and Environmental Sciences',
	'Agricultural and Resource Economics',
	'American Studies',
	'Animal Science',
	'Applied Science',
	'Anthropology',
	'Art History Program',
	'Art Studio Program',
	'Asian American Studies',
	'Avian Science',
	'Biological and Agricultural Engineering',
	'Biological Sciences, College of Evolution and Ecology',
	'Biological Sciences, College of Microbiology',
	'Biological Sciences, College of Molecular and Cellular Biology',
	'Biological Sciences, College of Neurobiology, Physiology and Behavior',
	'Biological Sciences, College of Plant Biology',
	'Biomedical Engineering',
	'Chemical Engineering and Materials Science Department',
	'Chemistry',
	'Chicano Studies Program',
	'Chinese',
	'Civil and Environmental Engineering',
	'Classics',
	'Communication',
	'Comparative Literature',
	'Computer Science',
	'Design Program',
	'East Asian Languages and Cultures: Chinese',
	'Economics',
	'Education, School of',
	'Electrical and Computer Engineering',
	'Microfabrication Facility',
	'Engineering, College of',
	'English',
	'Entomology and Nematology',
	'Environmental Design (Landscape Architecture)',
	'Environmental Science and Policy',
	'Environmental Toxicology',
	'Evolution and Ecology',
	'Exercise Science',
	'Film Studies Program',
	'Food Science and Technology',
	'French',
	'German',
	'Geology',
	'Graduate School of Management',
	'History',
	'Human Ecology',
	'Center for Design Research (CDR)',
	'Humanities Program',
	'International Relations Program',
	'Italian',
	'Japanese',
	'Land, Air, and Water Resources Atmospheric Sciences',
	'Land, Air, and Water Resources Hydrology',
	'Land, Air, and Water ResourcesSoils & Biogeochemistry',
	'Law, School of',
	'The University Library',
	'Linguistics',
	'Management, Graduate School of',
'	Mathematics',
'	Mechanical and Aeronautical Engineering',
'	Advanced Highway Maintenance and Construction Technology Center',
'	Medical Pathology',
'	Medicine, School of Anesthesiology',
'	Medicine, School of Biochemistry and Molecular Medicine',
'	Medicine, School of Cardiovascular Medicine',
'	Medicine, School of Cell Biology and Human Anatomy',
'	Medicine, School of Dermatology',
'	Medicine, School of Emergency Medicine',
'	Medicine, School of Family and Community Medicine',
'	Medicine, School of Infectious Diseases',
'	Medicine, School of Internal Medicine',
'	Medicine, School of Medical Microbiology & Immunology',
'	Medicine, School of Neurological Surgery',
'	Medicine, School of Neurology',
'	Medicine, School of Obstetrics and Gynecology',
'	Medicine, School of Ophthalmology',
'	Medicine, School of Pathology',
'	Medicine, School of Pediatrics', 
'	Medicine, School of Pediatrics, Cleft and Craniofacial Reconstruction',
'	Medicine, School of Pharmacology',
'	Medicine, School of Physical Medicine and Rehabilitation',
'	Medicine, School of Physiology and Membrane Biology',
'	Medicine, School of Psychiatry',
'	Medicine, School of Public Health Sciences',
'	Medicine, School of Surgery',
'	Medicine, School of Urology',
'	Medieval Studies',
'	Microbiology',
'	Middle East/South Asia Studies',
'	Military Science',
'	Molecular and Cellular Biology',
'	Music',
'	Native American Studies',
'	Neurobiology, Physiology and Behavior',
'	Neuroscience, Center for',
'	Nursing, Betty Irene Moore School of',
'	Nutrition',
'	Philosophy',
'	Physics',
'	Plant Biology',
'	Plant Pathology',
'	Plant Sciences',
'	Political Science',
'	Population Biology, Graduate Group in',
'	Psychiatry',
'	Psychology',
'	Religious Studies',
'	Russian',
'	School of Law',
'	School of Nursing (Betty Irene Moore)',
'	Sociology',
'	Spanish',
'	Statistics',
'	Division of Textiles and Clothing',
'	Theatre and Dance',
'	Veterinary Medicine, School of California National Primate Research Center',
'	Veterinary Medicine, School of Molecular Biosciences',
'	Viticulture & Enology',
'	Wildlife, Fish and Conservation Biology',
'	Women and Gender Studies'
	];
	Inventory.getInventoryBasedOnId($routeParams.id).then(function(data){
		app.currentInventory = data.data.inventory._id;
		product = data.data.inventory.product;
		barcode = data.data.inventory.barcode;
	});

	app.checkOutForm = function(newData){
		if($scope.newData.newFirstName == null || $scope.newData.newFirstName == '' || $scope.newData.newLastName == null || $scope.newData.newLastName == ''  || $scope.newData.newEmail == null || $scope.newData.newEmail == ''){
			
		} else {	
			var inventoryObject = {};
			var historyObject = {};
			inventoryObject._id = app.currentInventory;
			inventoryObject.firstName = $scope.newData.newFirstName;
			inventoryObject.lastName = $scope.newData.newLastName;
			inventoryObject.email = $scope.newData.newEmail;
			inventoryObject.phoneNumber = $scope.newData.newPhoneNumber;
			inventoryObject.title = $scope.newData.newTitle;
			inventoryObject.department = $scope.model;
			inventoryObject.location = $scope.newData.newLocation;
			inventoryObject.chargeNumber = $scope.newData.newChargeNumber;
			inventoryObject.supervisorFirstName = $scope.newData.newSupervisorFirstName;
			inventoryObject.supervisorLastName = $scope.newData.newSupervisorLastName;
			inventoryObject.supervisorEmail = $scope.newData.newSupervisorEmail;
			inventoryObject.supervisorPhoneNumber = $scope.newData.newSupervisorPhoneNumber;
			inventoryObject.isCheckedIn = 'false';
			inventoryObject.dateCheckedOut = Date.now();

			historyObject.product = product;
			historyObject.barcode = barcode;
			historyObject.checkedType = 'checked out';
			historyObject.firstName = $scope.newData.newFirstName;
			historyObject.lastName =  $scope.newData.newLastName;
			historyObject.email =  $scope.newData.newEmail;
			historyObject.date = Date.now();
			historyObject.phoneNumber =  $scope.newData.newPhoneNumber;
			historyObject.supervisorFirstName =  $scope.newData.newSupervisorFirstName;
			historyObject.supervisorLastName =  $scope.newData.newSupervisorLastName;
			historyObject.supervisorEmail =  $scope.newData.newSupervisorEmail;
			historyObject.supervisorPhoneNumber =  $scope.newData.newSupervisorPhoneNumber;
			historyObject.title =  $scope.newData.newTitle;
			historyObject.department =  $scope.model;
			historyObject.location =  $scope.newData.newLocation;
			historyObject.chargeNumber =  $scope.newData.newChargeNumber;
			historyObject.description = historyObject.firstName + " " + historyObject.lastName + " " + historyObject.checkedType + " a " + historyObject.product;

			History.create(historyObject);


			Inventory.checkOutUpdate(inventoryObject);
			app.errorMsg = false;
			app.loading = true;
			app.successMsg = 'Checking out ....Redirecting';
			$timeout(function(){
				$location.path('/');
			}, 2000);
		}	
	};


});