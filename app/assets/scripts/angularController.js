'use strict';

var app = angular.module("myApp", ["ngRoute","ngMaterial","ng-sortable","ngMessages",'angularUtils.directives.dirPagination','angularjs-dropdown-multiselect']);

function VariableData() {
    this.username = '';
    this.password = '';
    this.userId = '';
    this.userType = '';
    this.searchTerm = '';
    this.searchLocation = "Houston";
    this.searchResult = "";
    this.fullName = "";
    this.loggedInFlag = false;
    this.selectedDoctorId = '';
    this.previousPage = '';
};

//To save/load application state
app.service('appDataService', function(){
    var username = '';
    var password = '';
    var searchTerm = '';
    var searchLocation = "Houston";
    var searchResult = "";
    var fullName = "";
    var userId = "";
    var userType = "";
    var loggedInFlag = false;
    var selectedDoctorId = '';
    var previousPage = '';
    
    this.clearData = function(value){
        this.username = '';
        this.password = '';
        };
    
    this.setUsername = function(value){
                username=value;
        };
    this.getUsername = function() {
            return username;
        };
    
    this.setPassword = function(value){
                password=value;
        };
    this.getPassword = function() {
            return password;
        };
    
    this.setUserId = function(value){
                userId=value;
        };
    this.getUserId = function() {
            return userId;
        };
    
    this.setUserType = function(value){
                userType=value;
        };
    this.getUserType = function() {
            return userType;
        };
    
    this.setFullName = function(value){
                fullName=value;
        };
    this.getFullName = function() {
            return fullName;
        };
    
    this.setSearchTerm = function(value){
                searchTerm=value;
        };
    this.getSearchTerm = function() {
            return searchTerm;
        };
    
    this.setSearchResult = function(value){
                searchResult=value;
        };
    this.getSearchResult = function() {
            return searchResult;
        };
    
    this.setSearchLocation = function(value){
                searchLocation=value;
        };
    this.getSearchLocation = function() {
            return searchLocation;
        };
    
    this.setLoggedInFlag = function(value){
                loggedInFlag=value;
        };
    this.getLoggedInFlag = function() {
            return loggedInFlag;
        };
    
    this.setSelectedDoctorID = function(value){
                selectedDoctorId=value;
        };
    this.getSelectedDoctorID = function() {
            return selectedDoctorId;
        };
    
    this.setPreviousPage = function(value){
                previousPage=value;
        };
    this.getPreviousPage = function() {
            return previousPage;
        };
    
    this.saveVariableData = function (){
    
    console.log('Inside save state');
        
    var variableData = new VariableData();
    variableData.username = username;
    variableData.password = password ;
    variableData.searchTerm = searchTerm;
    variableData.searchLocation = searchLocation;
    variableData.searchResult = searchResult;
    variableData.userType = userType;
    variableData.userId = userId;
    variableData.fullName = fullName;
    variableData.loggedInFlag = loggedInFlag;
    variableData.selectedDoctorId = selectedDoctorId;
    variableData.previousPage = previousPage;
        
    
    sessionStorage.setItem('applicationState', JSON.stringify(variableData));
    console.log("ITEM SAVED");
        
    var temp = sessionStorage.getItem('applicationState');
    var variableData = $.parseJSON(temp);
    console.log("Item: "+variableData);
    
    };
    
    this.loadVariableData = function() {
    var temp = sessionStorage.getItem('applicationState');
    var variableData = $.parseJSON(temp);
    console.log(variableData);
    if(variableData != null)
    {
    username = variableData.username;
    password = variableData.password;
    searchTerm = variableData.searchTerm;
    searchLocation = variableData.searchLocation;
    searchResult = variableData.searchResult;
    userType = variableData.userType;
    userId = variableData.userId;
    fullName = variableData.fullName;
    loggedInFlag = variableData.loggedInFlag;
    selectedDoctorId = variableData.selectedDoctorId;
    previousPage = variableData.previousPage;
    }
    else {
    username = '';
    password = '';
    searchTerm = '';
    searchLocation = 'Austin';
    searchResult = '';
    fullName = '';
    userId = '';
    userType = '';
    loggedInFlag = false;
    selectedDoctorId = '';
    previousPage = '';
    }
    };
    
    this.resetVariableData = function(){
    username = '';
    password = '';
    searchTerm = '';
    searchLocation = "Austin";
    searchResult = "";
    fullName = "";
    userId = "";
    userType = "";
    loggedInFlag = false;
    selectedDoctorId = '';
    
    this.saveVariableData();
        
    };
    
});

//To make REST API Calls
app.factory('dataFactory', ['$http','$q','appDataService', function($http,$q,appDataService) {
    var dataFactory = {};
    
    var restUrl = "https://doctorsforme-api.herokuapp.com"; 
    
    dataFactory.getSearchResult = function (city, type){
        return $http.get(restUrl+'/search?city='+city+'&type='+type).then(function(response){
            return response.data;})
    };
    
    dataFactory.getLogin = function (Input_username,Input_password){
    return $http({
    method: 'POST',
    url: restUrl+'/login',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    transformRequest: function(obj) {
        var str = [];
        for(var p in obj)
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        return str.join("&");
    },
    data: {username: Input_username, password: Input_password}
    }).then(function (response) { return response.data;} );
};
    
    dataFactory.postSignup = function (name, username, password, email, phone, address, city, state, country, user_type){
    return $http({
    method: 'POST',
    url: restUrl+'/user',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    transformRequest: function(obj) {
        var str = [];
        for(var p in obj)
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        return str.join("&");
    },
    data: {
        name: name, 
        username: username, 
        password: password, 
        email: email, 
        phone: phone, 
        address: address, 
        city: city, 
        state: state, 
        country: country, 
        user_type: user_type
    }
    }).then(function (response) { return response.data;} );
};
    
    dataFactory.getPatientInfo = function (patient_id){
        return $http.get(restUrl+'/user?id='+patient_id+'&user_type=patient').then(function(response){
            return response.data;})
    };
    
    dataFactory.getDoctorInfo = function (doctor_id){
        return $http.get(restUrl+'/user?id='+doctor_id+'&user_type=doctor').then(function(response){
            return response.data;})
    };
    
    dataFactory.getDoctorAvailability = function (doctor_id){
        return $http.get(restUrl+'/availability?id='+doctor_id+'&user_type=doctor').then(function(response){
            return response.data;})
    };
    
    dataFactory.postAppointment = function (patientId, doctorId, dateInput, timeslot){
    return $http({
    method: 'POST',
    url: restUrl+'/appointment',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    transformRequest: function(obj) {
        var str = [];
        for(var p in obj)
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        return str.join("&");
    },
    data: {
        customer_id: patientId, 
        doctor_id: doctorId, 
        date: dateInput, 
        time: timeslot
    }
    }).then(function (response) { return response.data;} );
    };
    
    //make a get request to appointment API
    dataFactory.getApp = function(id,type){
        //return appList;
        var config = {
            params: {
                id: id,
                user_type: type
            }
        }

        return $http.get(restUrl+"/appointment", config);
    }
    
    //make a post request to review API
    dataFactory.postReview = function( data ) {
	return $http( {
		method: 'POST',
		url: restUrl + '/review',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		transformRequest: function( obj ) {
			var str = [];
			for ( var p in obj )
				str.push( encodeURIComponent( p ) + "=" + encodeURIComponent( obj[ p ] ) );
			return str.join( "&" );
		},
		data: {
			id: data.id,
			doctor_id: data.doctor_id,
			score: data.score,
			comment: data.comment,
			user_type: "patient"
		}
	} );

    };
    
    dataFactory.postAvailability=function(id,slots){
        return $http({
    method: 'POST',
    url: restUrl+'/availability',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    transformRequest: function(obj) {
        var str = [];
        for(var p in obj)
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        return str.join("&");
    },
    data: {
        id:id,
        /*available_slots:[
            {"date":"2017-04-25","time":"1300"}
        ]*/
        available_slots:JSON.stringify(slots)
    }
    });
    
    };
    
    //make a delete call to appointment API
    dataFactory.deleteApp = function(id){
        //return appList;
        console.log(id);
        return $http.delete(restUrl+"/appointment/"+id).then(function(response){
            return response.data;})
    };
    
    dataFactory.getDoctorReviews = function (doctor_id){
        return $http.get(restUrl+'/review?id='+doctor_id+'&user_type=doctor').then(function(response){
            return response.data;})
    }; 
    
    
    
    
    return dataFactory;
}]);

    
app.controller('search_resultsCntrl', ['$scope', '$location','appDataService','dataFactory','$window',function($scope, $location,appDataService,dataFactory,$window) {
    
    
    appDataService.loadVariableData();
    
    $scope.name = appDataService.getFullName();
    $scope.loggedIn = appDataService.getLoggedInFlag();
    console.log('LoggedInFlag:'+$scope.loggedIn);
    $scope.username = '';
    $scope.resultsLoadedFlag=false;
    
    console.log("UserID:"+appDataService.getUserId());

    if(appDataService.getLoggedInFlag()){
        $scope.fullname = appDataService.getFullName();
        //@Silvia Can use this variable in the front end
        console.log('Full Name received:'+ $scope.fullname);
    }
    
    
    if($scope.name = "")
    $scope.namedMessage = false;
    else
    $scope.namedMessage = true;   
    
    $scope.searchTerm = appDataService.getSearchTerm();
    $scope.searchLocation = appDataService.getSearchLocation();
    
    $scope.emptyResult = true;
    
    var searchResult = dataFactory.getSearchResult($scope.searchLocation,$scope.searchTerm);
    searchResult.then(function(result){
    $scope.searchResult = result;
    $scope.resultsLoadedFlag=true;
    appDataService.setSearchResult($scope.searchResult);
        
    if ($scope.searchResult.success == true){
    $scope.doctorList = $scope.searchResult.search;
    
    
    if($scope.doctorList.length == 0)
    {$scope.emptyResult = true;} 
    else
    {$scope.emptyResult = false;}
    
    };
    
    });
    
    $scope.locationButtonClick = function (location) {
    $scope.searchLocation = location;
    appDataService.setSearchLocation(location);
    };
    
    $scope.searchButtonClick = function () {
    appDataService.setSearchTerm($scope.searchTerm);
    appDataService.saveVariableData();
    $window.location.href = './search-results.html';
    };
    
    $scope.signoutButtonClick = function () {
    appDataService.resetVariableData();
    $window.location.href = './index.html';
    };
    
    $scope.seeReviewsButtonClick = function (value) {
    appDataService.setSelectedDoctorID(value);
    console.log('Saving selected Doctor:'+value);
    appDataService.saveVariableData();
    $window.location.href = './single-doctor.html';
    };
    
    $scope.bookAppointmentClick = function (value) {
    console.log('UserId: '+appDataService.getUserId);
    if(!$scope.loggedIn)
    {
    appDataService.setPreviousPage('./search-results.html');
    appDataService.saveVariableData();
    $window.location.href = './login.html';   
    }
    else{
    console.log('Doctor Id:'+value);
    appDataService.setSelectedDoctorID(value);
    appDataService.saveVariableData();
    $window.location.href = './book-appointment.html';
    }
    };
    
    //orderby
    $scope.optionList=['Popularity','Experience'];
    $scope.selectedOption="Popularity";
    $scope.sortText="-rating";
    $scope.sortByOption=function(){
        if($scope.selectedOption === "Popularity"){
            $scope.sortText="-rating";
        }
        else{
            $scope.sortText="-experience";
        }
    };
    
    //filter
    $scope.allFilter=true;
    $scope.expFilter=false;
    $scope.ratingFilter=false;
    
}]);

app.controller('loginCntrl', ['$scope', '$location','appDataService','dataFactory','$window',function($scope, $location,appDataService,dataFactory,$window) {
    
    appDataService.loadVariableData();
    
    $scope.loggedIn = appDataService.getLoggedInFlag();
    
    
    
    if($scope.loggedIn)
    $window.location.href = './index.html';
    
    if(appDataService.getLoggedInFlag()){
        $scope.fullname = appDataService.getFullName();
        //@Silvia Can use this variable in the front end
        console.log('Full Name received:'+ $scope.fullname);
    };
    
    $scope.username = "";
    $scope.password = "";
    
    $scope.reply = "";
    
    
    $scope.errorFlag = false;
    
    $scope.loginButtonClick = function (){
        
        
    var searchResult = dataFactory.getLogin($scope.username,$scope.password);
    searchResult.then(function(result){
    $scope.reply = result;
        
    if($scope.reply.success == true){
    appDataService.setUserId($scope.reply.profile_id);
    appDataService.setUsername($scope.username);
    appDataService.setPassword($scope.password);
    appDataService.setFullName($scope.reply.full_name);
    appDataService.setUserType($scope.reply.user_type);
    appDataService.setLoggedInFlag(true);
    appDataService.saveVariableData();
    console.log("UserID:"+appDataService.getUserId());
    if(appDataService.getPreviousPage() != '')
    {
     $window.location.href = appDataService.getPreviousPage();   
    }
    else
    {$window.location.href = './index.html';}
    }
    else{
    $scope.errorFlag = true;
    $scope.username = "";
    $scope.password = "";
    $scope.reply = "";
    appDataService.saveVariableData();
    }    
    });

       
    };
    
    $scope.signoutButtonClick = function () {
    appDataService.resetVariableData();
     $window.location.href = './index.html';  
    
    };
           
}]);

app.controller('signupCntrl', ['$scope', '$location','appDataService','dataFactory','$window',function($scope, $location,appDataService,dataFactory,$window) {
    
    $scope.errorFlag = true;
    $scope.errorMessage = "";
    $scope.reply = "";
    $scope.loggedIn = appDataService.getLoggedInFlag();
    
    if($scope.loggedIn)
    $window.location.href = './index.html';
    
    if(appDataService.getLoggedInFlag()){
        $scope.fullname = appDataService.getFullName();
        //@Silvia Can use this variable in the front end
        console.log('Full Name received:'+ $scope.fullname);
    };
    
    $scope.signupButtonClick = function (){
    
    var searchResult = dataFactory.postSignup($scope.user.name, 
                                              $scope.user.username, 
                                              $scope.user.password, 
                                              $scope.user.email, 
                                              $scope.user.phone, 
                                              $scope.user.address, 
                                              $scope.user.city, 
                                              $scope.user.state, 
                                              $scope.user.country, 
                                              $scope.user.user_type) 
    {
    searchResult.then(function(result){
    $scope.reply = result;
    console.log($scope.reply);
    
    if($scope.reply.success == true){
    appDataService.setUserId($scope.reply.profile_id);
    appDataService.setUsername($scope.username);
    appDataService.setPassword($scope.password);
    appDataService.setFullName($scope.user.name);
    appDataService.setUserType($scope.reply.user_type);
    appDataService.setLoggedInFlag(true);
    appDataService.saveVariableData();
    $window.location.href = './index.html';
    }
    else{
    
    $scope.errorFlag = true;
    $scope.user = "";
    $scope.errorMessage = $scope.reply.error;
    appDataService.saveVariableData();
    }
        
    });
        
    };
    
};
    
    $scope.signoutButtonClick = function () {
    appDataService.resetVariableData();
    $window.location.href = './index.html';
    };
    
}]);

app.controller('bookAppointmentCntrl', ['$scope', '$location','appDataService','dataFactory','$window',function($scope, $location,appDataService,dataFactory,$window) {
    
    //Populating Test Data - Should be commented after integration
//  appDataService.setSelectedDoctorID(4);
//  appDataService.setUserId(159);
//  appDataService.saveVariableData();
    appDataService.loadVariableData();
    
    $scope.loggedIn = appDataService.getLoggedInFlag();
    
    if(appDataService.getLoggedInFlag()){
        $scope.fullname = appDataService.getFullName();
        //@Silvia Can use this variable in the front end
        console.log('Full Name received:'+ $scope.fullname);
    };
 
    
    $scope.patientId = appDataService.getUserId();
    $scope.selectedDoctorID = appDataService.getSelectedDoctorID();
    
    $scope.selectedValue = 2;
    
    $scope.noSlotsFlag = true;
    $scope.dataLoadedFlag=false;
    
    var patientDataResponse = dataFactory.getPatientInfo($scope.patientId);
    patientDataResponse.then(function(result){
    $scope.patientDataResponse = result;
    if($scope.patientDataResponse.success == true)
    {
        $scope.patient= $scope.patientDataResponse.info;
    }
        
        var doctorDataResponse = dataFactory.getDoctorInfo($scope.selectedDoctorID);
        doctorDataResponse.then(function(result){
            $scope.doctorDataResponse = result;
            if($scope.doctorDataResponse.success == true)
            {
            $scope.doctor= $scope.doctorDataResponse.info;
            $scope.dataLoadedFlag=true;
            };
            
            var availableSlotsDataResponse  = dataFactory.getDoctorAvailability($scope.selectedDoctorID);
            availableSlotsDataResponse.then(function(result){
                $scope.availableSlotsDataResponse = result;
                if($scope.availableSlotsDataResponse.success == true)
                {
                $scope.availableSlots = $scope.availableSlotsDataResponse.available_slots;
                
                    if($scope.availableSlots.length == 0)
                    {$scope.noSlotsFlag = true;}
                    else
                    {$scope.noSlotsFlag = false;}
                
                };
            });
            
        });
        
    });
    
    $scope.selectSlotClick = function (selectedDate, selectedTime) {
    $scope.selectedDate = selectedDate;
    $scope.selectedTime = selectedTime; 
    };
    
    $scope.bookButtonClick = function () {
        
    var bookAppointment = dataFactory.postAppointment($scope.patientId,$scope.selectedDoctorID,$scope.selectedDate,$scope.selectedTime);
        
    bookAppointment.then(function(result){
        $scope.result = result;
        
        if($scope.result.success == true)
        {
          $window.location.href = './view-appointments.html';      
        }
    });
        
    };    
    
    $scope.signoutButtonClick = function () {
    appDataService.resetVariableData();
    $window.location.href = './index.html';
    };
    
}]);

app.controller('singleDoctorCntrl', ['$scope', '$location','appDataService','dataFactory','$window',function($scope, $location,appDataService,dataFactory,$window) {
    

    
//Populating Test Data - Should be commented after integration
//appDataService.setSelectedDoctorID(4);
//appDataService.setUserId(159);
//appDataService.saveVariableData();
    $scope.doctor={rating:5};
    appDataService.loadVariableData();
    $scope.doctorLoadedFlag=false;
    $scope.reviewsLoadedFlag=false;
    
    $scope.loggedIn = appDataService.getLoggedInFlag();
    
    if(appDataService.getLoggedInFlag()){
        $scope.fullname = appDataService.getFullName();
        //@Silvia Can use this variable in the front end
        console.log('Full Name received:'+ $scope.fullname);
    };
    
    console.log('Retrieved Doctor Id:'+ appDataService.getSelectedDoctorID());
 
    
    $scope.patientId = appDataService.getUserId();
    $scope.selectedDoctorID = appDataService.getSelectedDoctorID();
    
    var doctorDataResponse = dataFactory.getDoctorInfo($scope.selectedDoctorID);
    doctorDataResponse.then(function(result){
        $scope.doctorDataResponse = result;
        if($scope.doctorDataResponse.success == true)
        {
        $scope.doctor= $scope.doctorDataResponse.info;
        $scope.doctorLoadedFlag=true;
        //$scope.doctor.photo_url = "http://s-media-cache-ak0.pinimg.com/736x/e2/9f/ee/e29fee57b73f61a9f6e1718185ebe738.jpg";

        };
    });
    
    $scope.reviews = [];
    $scope.noReviewsFlag = true;
    
    var reviewsDataResponse = dataFactory.getDoctorReviews($scope.selectedDoctorID);
    reviewsDataResponse.then(function(result){
        $scope.reviewsDataResponse = result;
        if($scope.reviewsDataResponse.success == true)
        {
        $scope.reviews= $scope.reviewsDataResponse.reviews;
        $scope.reviewsLoadedFlag=true;
            
        if($scope.reviews.length == 0)
        $scope.noReviewsFlag = true; 
        else
        $scope.noReviewsFlag = false; 
            
        };
    });
    
    $scope.bookAppointmentClick = function () {
    if(!$scope.loggedIn)
    {
    appDataService.setPreviousPage('./single-doctor.html');
    appDataService.saveVariableData();
    $window.location.href = './login.html';   
    }
    else{
    //console.log('Doctor Id:'+value);
    //appDataService.setSelectedDoctorID(value);
    //appDataService.saveVariableData();
    $window.location.href = './book-appointment.html';
    }
    };
    
    $scope.signoutButtonClick = function () {
    appDataService.resetVariableData();
    $window.location.href = './index.html';
    };
    
}]);


//appointmentController
//function: handle the frontend and backend communication for view-appointments page
app.controller( 'appointmentController', [ '$scope', 'appDataService', '$window', 'dataFactory', function( $scope, appDataService, $window, dataFactory ) {

	$scope.userId;
	$scope.userType;
	$scope.isPatient = true;
	$scope.docLocation = "";
	$scope.message = "";
	$scope.loggedIn = false;
	$scope.fullname = "";
    
    //function to check user login before page load
    //if logged in, get and store user data
    //if not, redirect to sign in page
	$scope.init = function() {
		appDataService.loadVariableData();
		if ( appDataService.getLoggedInFlag() ) {
			$scope.loggedIn = true;
			$scope.userId = appDataService.getUserId();
			$scope.fullname = appDataService.getFullName();
			console.log( 'Full Name received:' + $scope.fullname );
			if ( appDataService.getUserType() == "doctor" ) {
				$scope.userType = "doctor";
			} else {
				$scope.userType = "patient";
			}
		} else {
			appDataService.setPreviousPage( './view-appointments.html' );
			appDataService.saveVariableData();
			$window.location.href = './login.html';
			console.log( "please log in" );
		}
	}
	$scope.init();

	//get location for doctor
	if ( $scope.userType == "doctor" ) {
		$scope.isPatient = false;
		dataFactory.getDoctorInfo( $scope.userId )
			.then(
				function( response ) {
					$scope.docLocation = response.info.address + ", " + response.info.city;
				},
				function( response ) {
					console.log( "error" );
				}
			);

	}
 
	//get appointments from backend
	$scope.appList = [];
	dataFactory.getApp( $scope.userId, $scope.userType )
		.then(
			function( response ) {
				$scope.appList = response.data.appointments;
			},
			//error handling
			function( response ) {
				console.log( response );
			}
		);
    
    //variables and functions to control show and hide for the review form and success message
	$scope.selectedIndex;
	$scope.formShow = false;
	$scope.successReviewShow = false;
    
    $scope.setFormShow = function( value ) {
		$scope.formShow = value;
	}
	$scope.setSuccessReviewShow = function( value ) {
			$scope.successReviewShow = value;
    }

	//form variables
	$scope.review = {
		id: $scope.userId,
		user_type: "patient",
		doctor_id: "",
		score: 5,
		comment: ""
	};
    
    //send review function
	$scope.sendReview = function() {
		console.log( $scope.review );
		dataFactory.postReview( $scope.review )
			.then(
				function( response ) {
					if ( response.status ) {
						console.log( response );
						$scope.setFormShow( false );
						$scope.setSuccessReviewShow( true );
					}
					//error handling
					else {
						console.log( response );
					}

				}
			);
		$scope.review.score = 5;
		$scope.review.comment = "";

	}

	//cancel appointment function
	$scope.cancelApp = function( appId ) {

		var deleteApp = dataFactory.deleteApp( appId );

		deleteApp.then( function( result ) {
			$scope.messageX = result;
			console.log( 'Here: ' + $scope.messageX );
			$window.location.href = './view-appointments.html';
		} );


	}

	//reschedule appointment function
	$scope.rescheduleApp = function( app ) {
		appDataService.loadVariableData();
		appDataService.setSelectedDoctorID( app.doctor_id );
		appDataService.saveVariableData();

		var rescheduleApp = dataFactory.deleteApp( app.appointment_id );

		rescheduleApp.then(
			function( response ) {
				console.log( "success" );
				$window.location.href = './book-appointment.html';
			}
		);

	};

	$scope.signoutButtonClick = function() {
		appDataService.resetVariableData();
		$window.location.href = './index.html';
	};

} ] );

//profileController
//function: handle the frontend and backend communication for profile page
app.controller( 'profileController', [ '$scope', 'appDataService', 'dataFactory', '$window', function( $scope, appDataService, dataFactory, $window ) {
    
    //define variables
	$scope.loggedIn = false;
	$scope.dataLoadedFlag = false;
	$scope.userId = ""
	$scope.userType = ""
	$scope.fullname = ""
	$scope.isDoc = false;
	$scope.user;
	$scope.choices = [ {
		id: 1,
		date: "",
		time: []
	}, {
		id: 2,
		date: "",
		time: []
	} ];
	$scope.timeData = [ {
		id: "0900",
		label: "9:00 AM"
	}, {
		id: "1000",
		label: "10:00 AM"
	}, {
		id: "1100",
		label: "11:00 AM"
	}, {
		id: "1200",
		label: "12:00 PM"
	}, {
		id: "1300",
		label: "1:00 PM"
	}, {
		id: "1400",
		label: "2:00 PM"
	}, {
		id: "1500",
		label: "3:00 PM"
	}, {
		id: "1600",
		label: "4:00 PM"
	}, {
		id: "1700",
		label: "5:00 PM"
	}, {
		id: "1800",
		label: "6:00 PM"
	} ];
	$scope.dateData = [];
	$scope.newAvailability = [];
	$scope.availableSlots = [];

	//verify login and redirecting before page load
	$scope.init = function() {
		appDataService.loadVariableData();



		if ( appDataService.getLoggedInFlag() ) {
			$scope.loggedIn = true;
			$scope.userId = appDataService.getUserId();
			$scope.fullname = appDataService.getFullName();
			console.log( 'Full Name received:' + $scope.fullname );
			if ( appDataService.getUserType() == "doctor" ) {
				$scope.userType = "doctor";
			} else {
				$scope.userType = "patient";
			}
		} else {
			appDataService.setPreviousPage( './profile.html' );
			appDataService.saveVariableData();
			$window.location.href = './login.html';
			console.log( "please log in" );
		}
	}
	$scope.init();

    //handle search term
	console.log( 'Search Term:' + appDataService.getSearchTerm() );
	$scope.slotFlag = false;
	if ( appDataService.getSearchTerm() == 'TRUE' ) {
		console.log( 'In here' );
		$scope.slotFlag = true;
		appDataService.setSearchTerm( '' );
	}


	//get user information
	if ( $scope.userType === "doctor" ) {
		$scope.isDoc = true;
		dataFactory.getDoctorInfo( $scope.userId )
			.then(
				function( response ) {
					$scope.user = response.info;
					$scope.dataLoadedFlag = true;
				},
				function( response ) {
					console.log( "error:" + response );
				}
			);
	} else {
		dataFactory.getPatientInfo( $scope.userId )
			.then(
				function( response ) {
					$scope.user = response.info;
					$scope.dataLoadedFlag = true;
				},
				function( response ) {
					console.log( "error:" + response );
				}
			);
	}

	//load date data
    //function load date option box with work dates within 2 weeks from today
	var today = new Date();
	$scope.addDays = function( date, days ) {
		var dat = new Date( date );
		dat.setDate( date.getDate() + days );
		return dat;
	}
	$scope.processDate = function( date ) {
		var str = date.getFullYear()
			.toString() + "-";
		if ( date.getMonth() + 1 < 10 ) {
			str = str + "0" + ( date.getMonth() + 1 )
				.toString() + "-";
		} else {
			str = str + ( date.getMonth() + 1 )
				.toString() + "-";
		}
		if ( date.getDate() < 10 ) {
			str = str + "0" + date.getDate()
				.toString();
		} else {
			str = str + date.getDate()
				.toString();
		}
		return str;
	}
	for ( var i = 1; i <= 14; i++ ) {
		var date = $scope.addDays( today, i );
		if ( date.getDay() != 6 && date.getDay() != 0 ) {
			var dateStr = $scope.processDate( date );
			$scope.dateData.push( dateStr );
		}
	}

	//add and delete field methods
	$scope.removeChoice = function() {
		var lastItem = $scope.choices.length - 1;
		$scope.choices.splice( lastItem );
	}
	$scope.addNewChoice = function() {
		var newItemNo = $scope.choices.length + 1;
		$scope.choices.push( {
			'id': newItemNo,
			date: "",
			time: []
		} );
	};

	//function to submit time slots
	$scope.submitTimeSlots = function() {
		//gather data from select box
		for ( var i = 0; i < $scope.choices.length; i++ ) {
			for ( var j = 0; j < $scope.choices[ i ].time.length; j++ ) {
				var slot = {
						date: $scope.choices[ i ].date,
						time: $scope.choices[ i ].time[ j ].id
					}
				$scope.newAvailability.push( slot );
			}
		}
		console.log( $scope.newAvailability );
        //make a post request to API
		dataFactory.postAvailability( $scope.userId, $scope.newAvailability )
			.then(
				function( response ) {
					console.log( "success" );
					console.log( response );
					//$window.location.href = './profile.html';
					appDataService.setSearchTerm( 'TRUE' );
					appDataService.saveVariableData();
					$window.location.href = './profile.html';

				},
				function( response ) {
					console.log( response );
				}
			);

	};
    
    //sign out function
	$scope.signoutButtonClick = function() {
		console.log( 'Her1' );
		appDataService.resetVariableData();
		$window.location.href = './index.html';
		console.log( 'Her2' );
	};

} ] );

//data filter
//function: filter datatime to keep the datetime in the future 
app.filter( 'futureFilter', function() {
	return function( items ) {
		var curDate = new Date();
		var array = [];
		for ( var i = 0; i < items.length; i++ ) {
			var date = items[ i ].date;
			var time = items[ i ].time.substring( 0, 2 );
			var datetime = date + "T" + time + ":00:00Z";
			var appDate = new Date( datetime );
			if ( appDate > curDate ) {
				array.push( items[ i ] );
			}
		}
		return array;
	}
} );

//data filter
//function: filter datatime to keep the datetime in the past 
app.filter( 'pastFilter', function() {
	return function( items ) {
		var curDate = new Date();
		var array = [];
		for ( var i = 0; i < items.length; i++ ) {
			var date = items[ i ].date;
			var time = items[ i ].time.substring( 0, 2 );
			var datetime = date + "T" + time + ":00:00Z";
			var appDate = new Date( datetime );
			if ( appDate <= curDate ) {
				array.push( items[ i ] );
			}
		}
		return array;
	}
} );

app.filter('searchResultFilter',function(){
    return function (items,arg1,arg2,arg3){
        var array=[];
        if(arg1){
            return items;
        }
        else{
            if(arg2&&arg3){
                for(var i=0; i<items.length;i++){
                    if(items[i].experience>=5 || items[i].rating>=4){
                        array.push(items[i]);
                    }
                }
                console.log("well rate and experience");
                return array;
            }
            else if(arg2){
                for(var i=0; i<items.length;i++){
                    if(items[i].experience>=5){
                        array.push(items[i]);
                    }
                   
                }
                console.log("experience");
                   return array; 
            }
            else if(arg3){
                for(var i=0; i<items.length;i++){
                    if(items[i].rating>=4){
                        array.push(items[i]);
                    }
                   
                }
                 console.log("well rate");
                return array; 
            }
            else{
                return items;
            }
        }
        
    }
});

//data filter
//funcion: format date
app.filter( 'dateFilter', function() {
	return function( item ) {
		var date = item.split( "-" );
		var month;
		switch ( date[ 1 ] ) {
			case "01":
				month = "Jan"
				break;
			case "02":
				month = "Feb"
				break;
			case "03":
				month = "Mar"
				break;
			case "04":
				month = "Apr"
				break;
			case "05":
				month = "May"
				break;
			case "06":
				month = "Jun"
				break;
			case "07":
				month = "Jul"
				break;
			case "08":
				month = "Aug"
				break;
			case "09":
				month = "Sep"
				break;
			case "10":
				month = "Oct"
				break;
			case "11":
				month = "Nov"
				break;
			case "12":
				month = "Dec"
				break;
			default:
				"Jan"
		}
		return month + " " + date[ 2 ] + ", " + date[ 0 ];
	}
} );

//custom data filter
//format time
app.filter( 'timeFilter', function() {
	return function( item ) {
		return item.substring( 0, 2 ) + ":00"
	}
} );

//custom angularJs directive
//function: to display rating in stars
app.directive( 'starRating', function() {
	return {
		restrict: 'A',
		template: '<ul class="rating">' +
			'<li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">' +
			'\u2605' +
			'</li>' +
			'</ul>',
		scope: {
			ratingValue: '=',
			max: '=',
			onRatingSelected: '&'
		},
		link: function( scope, elem, attrs ) {

			var updateStars = function() {
				scope.stars = [];
				for ( var i = 0; i < scope.max; i++ ) {
					scope.stars.push( {
						filled: i < scope.ratingValue
					} );
				}
			};

			scope.toggle = function( index ) {
				scope.ratingValue = index + 1;
				scope.onRatingSelected( {
					rating: index + 1
				} );
			};

			scope.$watch( 'ratingValue', function( oldVal, newVal ) {
				if ( newVal ) {
					updateStars();
				}
			} );
		}
	}
} );

//delete confirmation box directive
app.directive('ngConfirmClick', [
    function(){
        return {
            link: function (scope, element, attr) {
                var msg = attr.ngConfirmClick || "Are you sure?";
                var clickAction = attr.confirmedClick;
                element.bind('click',function (event) {
                    if ( window.confirm(msg) ) {
                        scope.$eval(clickAction)
                    }
                });
            }
        };
}])