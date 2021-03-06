angular.module('inventoryCheckOutFormController',[])
// Controller for the inventory check out form
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
	'Biological Sciences: College of Evolution and Ecology',
	'Biological Sciences: College of Microbiology',
	'Biological Sciences: College of Molecular and Cellular Biology',
	'Biological Sciences: College of Neurobiology, Physiology and Behavior',
	'Biological Sciences: College of Plant Biology',
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
	'School of Education',
	'Electrical and Computer Engineering',
	'Microfabrication Facility',
	'College of Engineering',
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
	'Land Air and Water Resources: Atmospheric Sciences',
	'Land Air and Water Resources: Hydrology',
	'Land Air and Water Resources: Soils & Biogeochemistry',
	'School of Law',
	'The University Library',
	'Linguistics',
	'Graduate School of Management',
	'Mathematics',
	'Mechanical and Aeronautical Engineering',
	'Advanced Highway Maintenance and Construction Technology Center',
	'Medical Pathology',
	'Medicine: School of Anesthesiology',
	'Medicine: School of Biochemistry and Molecular Medicine',
	'Medicine: School of Cardiovascular Medicine',
	'Medicine: School of Cell Biology and Human Anatomy',
	'Medicine: School of Dermatology',
	'Medicine: School of Emergency Medicine',
	'Medicine: School of Family and Community Medicine',
	'Medicine: School of Infectious Diseases',
	'Medicine: School of Internal Medicine',
	'Medicine: School of Medical Microbiology & Immunology',
	'Medicine: School of Neurological Surgery',
	'Medicine: School of Neurology',
	'Medicine: School of Obstetrics and Gynecology',
	'Medicine: School of Ophthalmology',
	'Medicine: School of Pathology',
	'Medicine: School of Pediatrics', 
	'Medicine: School of Pediatrics, Cleft and Craniofacial Reconstruction',
	'Medicine: School of Pharmacology',
	'Medicine: School of Physical Medicine and Rehabilitation',
	'Medicine: School of Physiology and Membrane Biology',
	'Medicine: School of Psychiatry',
	'Medicine: School of Public Health Sciences',
	'Medicine: School of Surgery',
	'Medicine: School of Urology',
	'Medieval Studies',
	'Microbiology',
	'Middle East/South Asia Studies',
	'Military Science',
	'Molecular and Cellular Biology',
	'Music',
	'Native American Studies',
	'Neurobiology: Physiology and Behavior',
	'Center for Neuroscience',
	'Nursing: Betty Irene Moore School',
	'Nutrition',
	'Philosophy',
	'Physics',
	'Plant Biology',
	'Plant Pathology',
	'Plant Sciences',
	'Political Science',
	'Population Biology: Graduate Group',
	'Psychiatry',
	'Psychology',
	'Religious Studies',
	'Russian',
	'School of Law',
	'School of Nursing (Betty Irene Moore)',
	'Sociology',
	'Spanish',
	'Statistics',
	'Division of Textiles and Clothing',
	'Theatre and Dance',
	'Veterinary Medicine: School of California National Primate Research Center',
	'Veterinary Medicine: School of Molecular Biosciences',
	'Viticulture & Enology',
	'Wildlife: Fish and Conservation Biology',
	'Women and Gender Studies'
	];

	// Factory that gest inventory values based on the _id of the inventory. $http.get('/api/getInventoryIdBasedOnBarcode/' + barcode);
	// $routeParams.id grabs the _id value from the URL makes a get request with it. 
	Inventory.getInventoryBasedOnId($routeParams.id).then(function(data){
		app.currentInventory = data.data.inventory._id;
		product = data.data.inventory.product;
		barcode = data.data.inventory.barcode;
	});


	//when you check out, all the data in all entries are passed into this function
	app.checkOutForm = function(newData){
		if($scope.newData.newFirstName == null || $scope.newData.newFirstName == '' || $scope.newData.newLastName == null || $scope.newData.newLastName == ''  || $scope.newData.newEmail == null || $scope.newData.newEmail == ''){
			
		} else {	
			var inventoryObject = {}; //inventory object to update the inventory
			var historyObject = {}; //history object to create a new history log
			inventoryObject._id = app.currentInventory;
			inventoryObject.firstName = $scope.newData.newFirstName;
			inventoryObject.lastName = $scope.newData.newLastName;
			inventoryObject.email = $scope.newData.newEmail;
			inventoryObject.phoneNumber = $scope.newData.newPhoneNumber;
			inventoryObject.title = $scope.newData.newTitle;
			inventoryObject.department = $scope.model; // grabs the selection from scope for department
			inventoryObject.location = $scope.newData.newLocation;
			inventoryObject.chargeNumber = $scope.newData.newChargeNumber;
			inventoryObject.supervisorFirstName = $scope.newData.newSupervisorFirstName;
			inventoryObject.supervisorLastName = $scope.newData.newSupervisorLastName;
			inventoryObject.supervisorEmail = $scope.newData.newSupervisorEmail;
			inventoryObject.supervisorPhoneNumber = $scope.newData.newSupervisorPhoneNumber;
			inventoryObject.isCheckedIn = 'false'; // we change checked in value to false because it is no longer checked in
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

			// Factory that creates a new entry in the database of History that uses $http.post('/api/history', histData);
			History.create(historyObject);

			// Factory that updates the values of the inventory $http.put('/api/checkOutUpdate', id);
			Inventory.checkOutUpdate(inventoryObject);
			app.errorMsg = false;
			app.loading = true;
			app.successMsg = 'Successfully Checked-out ....Redirecting';
			// redirects after 2000 ms, (2seconds)
			$timeout(function(){
				$location.path('/');
			}, 2000);
		}	
	};


});