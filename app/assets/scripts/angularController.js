'use strict';

var app = angular.module("myApp", ["ngRoute","ngMaterial","ng-sortable","ngMessages"]);

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
    
    
    return dataFactory;
}]);

//Should be consolidated into dataFactory
app.factory('AppFactory',['$http',function($http){
    var appFac = {};
    var baseUrl="https://doctorsforme-api.herokuapp.com/";
    
    //get appointments
    appFac.getApp = function(){
        //return appList;
        var config = {
            params: {
                id: 159,
                user_type: "patient"
            }
        }

        return $http.get(baseUrl+"appointment", config);
    }
    
    appFac.creatReview = function(data){
        return $http.post(baseUrl+"review",data);
    }
    
    return appFac;
}]);
                
app.controller('search_resultsCntrl', ['$scope', '$location','appDataService','dataFactory','$window',function($scope, $location,appDataService,dataFactory,$window) {
    
    
    appDataService.loadVariableData();
    
    $scope.name = appDataService.getFullName();
    $scope.loggedIn = appDataService.getLoggedInFlag();
    console.log('LoggedInFlag:'+$scope.loggedIn);
    $scope.username = '';
    
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
    
    var searchResult = dataFactory.getSearchResult($scope.searchLocation,$scope.searchTerm);
    searchResult.then(function(result){
    $scope.searchResult = result;
        
    appDataService.setSearchResult($scope.searchResult);
        
    if ($scope.searchResult.success == true){
    $scope.doctorList = $scope.searchResult.search;  
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
    
    $scope.bookAppointmentClick = function (value) {
    if(appDataService.getUserId == '')
    {
     $window.location.href = './login.html';   
    }
    else{
    console.log('Doctor Id:'+value);
    appDataService.setSelectedDoctorID(value);
    appDataService.saveVariableData();
    $window.location.href = './book-appointment.html';
    }
    };
    
}]);

app.controller('loginCntrl', ['$scope', '$location','appDataService','dataFactory','$window',function($scope, $location,appDataService,dataFactory,$window) {
    
    appDataService.loadVariableData();
    
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
    $window.location.href = './index.html';
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
           
}]);

app.controller('signupCntrl', ['$scope', '$location','appDataService','dataFactory','$window',function($scope, $location,appDataService,dataFactory,$window) {
    
    $scope.errorFlag = true;
    $scope.errorMessage = "";
    $scope.reply = "";
    
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
    //appDataService.setUserId($scope.reply.profile_id);
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
    
}]);

app.controller('bookAppointmentCntrl', ['$scope', '$location','appDataService','dataFactory','$window',function($scope, $location,appDataService,dataFactory,$window) {
    
    //Populating Test Data - Should be commented after integration
//   appDataService.setSelectedDoctorID(4);
//   appDataService.setUserId(159);
//  appDataService.saveVariableData();
    appDataService.loadVariableData();
 
    
    $scope.patientId = appDataService.getUserId();
    $scope.selectedDoctorID = appDataService.getSelectedDoctorID();
    
    $scope.selectedValue = 2;
    
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
            };
            
            var availableSlotsDataResponse  = dataFactory.getDoctorAvailability($scope.selectedDoctorID);
            availableSlotsDataResponse.then(function(result){
                $scope.availableSlotsDataResponse = result;
                if($scope.availableSlotsDataResponse.success == true)
                {
                $scope.availableSlots = $scope.availableSlotsDataResponse.available_slots;
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
    
}]);

//Maintained by Silvia - use dataFactory for consolidated API calls, AppFactory is redundant. Load user data from the appdataservice
app.controller('appointmentController',['$scope','AppFactory','appDataService','$window',function($scope,AppFactory,appDataService,$window){
    //verify login
    $scope.userId;
    $scope.userType;
    $scope.init = function()
     {
        appDataService.loadVariableData();
        if(appDataService.getLoggedInFlag()){
        $scope.userId=appDataService.getUserId();
        $scope.userType=appDataService.getUserType();
        console.log($scope.userId+" "+$scope.userType);
        }
        else{
        $window.location.href = './login.html';
        console.log("please log in");
    }
     }

     $scope.init(); 
    
    //get appointments
    $scope.appList=[];
    AppFactory.getApp($scope.userId,$scope.userType)
    .then(
        function(response){
            $scope.appList = response.data.appointments;
        },
        //error handling
        function(response){
            console.log(response);
        }
    );
    
    $scope.selectedIndex;
    $scope.formShow = false;
    $scope.successReviewShow = false;
    
    //form variables
    $scope.review={id:142,user_type:"patient",doctor_id:142,score:5,comment:""};
    
    
    $scope.sendReview = function(){
        //console.log($scope.review);
        AppFactory.creatReview($scope.review)
        .then(
            function(response){
                if(response.status){
                    console.log(response);
                    formShow=false;
                    successReviewShow=true;
                }
                //error handling
                else{
                    console.log(response);
                }
                
            }
        );
    }
}]);

app.filter('futureFilter',function(){
    return function (items){
        var curDate = new Date();
        var array=[];
        for(var i=0; i<items.length;i++){
            var date=items[i].date.split("-");
            var time=items[i].time;
            var appDate = new Date(date[0],date[1]-1,date[2],time,0);
            if(appDate > curDate){
                array.push(items[i]);
            }
        }
        return array;
    }
});

app.filter('pastFilter',function(){
    return function (items){
        var curDate = new Date();
        var array=[];
        for(var i=0; i<items.length;i++){
            var date=items[i].date.split("-");
            var time=items[i].time;
            var appDate = new Date(date[0],date[1]-1,date[2],time,0);
            if(appDate <= curDate){
                array.push(items[i]);
            }
        }
        return array;
    }
});

app.filter('dateFilter',function(){
   return function (item){
       var date=item.split("-");
       var month;
       switch(date[1]) {
            case "1":
                month="Jan"
                break;
            case "2":
                month="Feb"
                break;
            case "3":
                month="Mar"
                break;
            case "4":
                month="Apr"
                break;
            case "5":
                month="May"
                break;
            case "6":
                month="Jun"
                break;
            case "7":
                month="Jul"
                break;
            case "8":
                month="Aug"
                break;
            case "9":
                month="Sep"
                break;
            case "10":
                month="Oct"
                break;
            case "11":
                month="Nov"
                break;
            case "12":
                month="Dec"
                break;
            default:
                "Jan"
        }
       return month+" "+date[2]+", "+date[0];
   } 
});

app.filter('timeFilter',function(){
    return function(item){
        if(item<"12"){
            return item+":00 AM";
        }
        else if(item=="12"){
                return item+":00 PM"
                }
        else{
            return item-12+":00 PM"
        }
    }
});

app.directive('starRating', function () {
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
        link: function (scope, elem, attrs) {

            var updateStars = function () {
                scope.stars = [];
                for (var i = 0; i < scope.max; i++) {
                    scope.stars.push({
                        filled: i < scope.ratingValue
                    });
                }
            };

            scope.toggle = function (index) {
                scope.ratingValue = index + 1;
                scope.onRatingSelected({
                    rating: index + 1
                });
            };

            scope.$watch('ratingValue', function (oldVal, newVal) {
                if (newVal) {
                    updateStars();
                }
            });
        }
    }
});