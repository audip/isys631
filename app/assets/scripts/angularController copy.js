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
    
    dataFactory.postReview=function(data){
        return $http({
    method: 'POST',
    url: restUrl+'/review',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    transformRequest: function(obj) {
        var str = [];
        for(var p in obj)
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        return str.join("&");
    },
    data: {
        id:data.id,
        doctor_id:data.doctor_id,
            score:data.score,
            comment:data.comment,
            user_type:"patient"
    }
    });
    
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
    
    dataFactory.deleteApp = function(id){
        //return appList;
        console.log(id);
        /*var config = {
            params: {
                //appointment_id: id
                appointment_id: 30
            }
        }*/
        
        return $http.delete(restUrl+"/appointment/"+id).then(function(response){
            return response.data;})

//        return $http.delete(restUrl+"/appointment/"+id);
    };
    
    dataFactory.getDoctorReviews = function (doctor_id){
        return $http.get(restUrl+'/review?id='+doctor_id+'&user_type=doctor').then(function(response){
            return response.data;})
    }; 
    
    
    
    
    return dataFactory;
}]);

//Should be consolidated into dataFactory
app.factory('AppFactory',['$http',function($http){
    var appFac = {};
    var baseUrl="https://doctorsforme-api.herokuapp.com/";
    
    //get appointments
    appFac.getApp = function(id,type){
        //return appList;
        var config = {
            params: {
                id: id,
                user_type: type
            }
        }

        return $http.get(baseUrl+"appointment", config);
    }
    
    appFac.creatReview = function(data){
        console.log(data);
        var review={
            id:data.id,
            doctori_id:data.doctor_id,
            score:data.score,
            comment:data.comment,
            user_type:"patient"
            
        }
        //return $http.post(baseUrl+"review",data);
        return $http.post(baseUrl+"review",review);
        
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
    
    $scope.emptyResult = true;
    
    var searchResult = dataFactory.getSearchResult($scope.searchLocation,$scope.searchTerm);
    searchResult.then(function(result){
    $scope.searchResult = result;
        
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
    $scope.optionList=['Popularity: Descending','Experience: Descending'];
    $scope.selectedOption="Popularity: Descending";
    $scope.sortText="-rating";
    $scope.sortByOption=function(){
        if($scope.selectedOption === "Popularity: Descending"){
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
    $scope.loggedIn = appDataService.getLoggedInFlag();
    
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
//  appDataService.setSelectedDoctorID(4);
//  appDataService.setUserId(159);
//  appDataService.saveVariableData();
    appDataService.loadVariableData();
    
    $scope.loggedIn = appDataService.getLoggedInFlag();
 
    
    $scope.patientId = appDataService.getUserId();
    $scope.selectedDoctorID = appDataService.getSelectedDoctorID();
    
    $scope.selectedValue = 2;
    
    $scope.noSlotsFlag = true;
    
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
    
}]);

app.controller('singleDoctorCntrl', ['$scope', '$location','appDataService','dataFactory','$window',function($scope, $location,appDataService,dataFactory,$window) {
    

    
//Populating Test Data - Should be commented after integration
//appDataService.setSelectedDoctorID(4);
//appDataService.setUserId(159);
//appDataService.saveVariableData();
    $scope.doctor={rating:5};
    appDataService.loadVariableData();
    
    $scope.loggedIn = appDataService.getLoggedInFlag();
    
    console.log('Retrieved Doctor Id:'+ appDataService.getSelectedDoctorID());
 
    
    $scope.patientId = appDataService.getUserId();
    $scope.selectedDoctorID = appDataService.getSelectedDoctorID();
    
    var doctorDataResponse = dataFactory.getDoctorInfo($scope.selectedDoctorID);
    doctorDataResponse.then(function(result){
        $scope.doctorDataResponse = result;
        if($scope.doctorDataResponse.success == true)
        {
        $scope.doctor= $scope.doctorDataResponse.info;
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
            
        if($scope.reviews.length == 0)
        $scope.noReviewsFlag = true; 
        else
        $scope.noReviewsFlag = false; 
            
        };
    });
    
    $scope.bookAppointmentClick = function () {
    if(!$scope.loggedIn)
    {
     $window.location.href = './login.html';   
    }
    else{
    //console.log('Doctor Id:'+value);
    //appDataService.setSelectedDoctorID(value);
    //appDataService.saveVariableData();
    $window.location.href = './book-appointment.html';
    }
    };
    
}]);


//Maintained by Silvia - use dataFactory for consolidated API calls, AppFactory is redundant. Load user data from the appdataservice
app.controller('appointmentController',['$scope','AppFactory','appDataService','$window','dataFactory',function($scope,AppFactory,appDataService,$window,dataFactory){
    //verify login
    appDataService.loadVariableData();
    $scope.loggedIn = appDataService.getLoggedInFlag();
    
    $scope.userId;
    $scope.userType;
    $scope.isPatient=true;
    $scope.docLocation="";
    $scope.message="";
    $scope.init = function()
     {
        appDataService.loadVariableData();
        if(appDataService.getLoggedInFlag()){
        $scope.userId=appDataService.getUserId();
        if(appDataService.getUserType()=="doctor"){
            $scope.userType="doctor";
        }
        else{
            $scope.userType="patient";
        }
        }
        else{
        $window.location.href = './login.html';
        console.log("please log in");
    }
     }

     $scope.init(); 
    
    //message load
    appDataService.loadVariableData();
    if(appDataService.getSelectedDoctorID()===""){
        $scope.message="Here are your appointments.";
    }
    else{
        $scope.message="You have successfully booked your appointment!";
        appDataService.setSelectedDoctorID("");
        appDataService.saveVariableData();
    }
    
    //get doc location
    if($scope.userType=="doctor"){
        $scope.isPatient=false;
        dataFactory.getDoctorInfo($scope.userId).then(
            function(response){
                $scope.docLocation=response.info.address+", "+response.info.city;
            },
            function(response){
            console.log("error");
        }
        );
        
    }
    
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
    $scope.formShow=false;
    $scope.successReviewShow = false;
    
    //form variables
    $scope.review={id:$scope.userId,user_type:"patient",doctor_id:"",score:5,comment:""};
    
    $scope.setFormShow=function(value){
        $scope.formShow=value;
    }
    $scope.setSuccessReviewShow=function(value){
        $scope.successReviewShow=value;
    }
    //send review
    $scope.sendReview = function(){
        console.log($scope.review);
        dataFactory.postReview($scope.review)
        .then(
            function(response){
                if(response.status){
                    console.log(response);
                    $scope.setFormShow(false);
                    $scope.setSuccessReviewShow(true);
                }
                //error handling
                else{
                    console.log(response);
                }
                
            }
        );
        $scope.review.score=5;
        $scope.review.comment="";
        
    }
    
    //cancel app
    $scope.cancelApp = function(appId){
        
        var deleteApp = dataFactory.deleteApp(appId);
        
        deleteApp.then(function(result){
            $scope.messageX = result;
            console.log('Here: '+$scope.messageX);
            $window.location.href = './view-appointments.html';
        });
        
//        $window.location.href = './view-appointments.html';
        
        
        
//        dataFactory.deleteApp(appId).then({
//            function(response){
//                console.log("success");
//                console.log(response);
//            }
//            ,function(response){
//            console.log(response);
//        }
//        });
//        //$window.location.reload();
//        setTimeout(function(){ $window.location.reload(); }, 3);
        
    }
    
    //reschedule app
    $scope.rescheduleApp = function(app){
        appDataService.loadVariableData();
        appDataService.setSelectedDoctorID(app.doctor_id);
        appDataService.saveVariableData();
        
        var rescheduleApp = dataFactory.deleteApp(app.appointment_id);
        
        rescheduleApp.then(
            function(response){
                console.log("success");
                $window.location.href = './book-appointment.html';}
            );
        
    }
}]);

app.controller('profileController',['$scope','appDataService','dataFactory','$window',function($scope,appDataService,dataFactory,$window){
    
    appDataService.loadVariableData();
    $scope.loggedIn = appDataService.getLoggedInFlag();
    
    $scope.userId=appDataService.getUserId();
    $scope.userType=appDataService.getUserType();
    $scope.fullname=appDataService.getFullName();
    $scope.isDoc=false;
    $scope.user;
    $scope.choices=[{id:1,date:"",time:[]},{id:2,date:"",time:[]}];
    $scope.timeData=[{id:"0900",label:"9:00 AM"},{id:"1000",label:"10:00 AM"},{id:"1100",label:"11:00 AM"},{id:"1200",label:"12:00 PM"},{id:"1300",label:"1:00 PM"},{id:"1400",label:"2:00 PM"},{id:"1500",label:"3:00 PM"},{id:"1600",label:"4:00 PM"},{id:"1700",label:"5:00 PM"},{id:"1800",label:"6:00 PM"}];
    $scope.dateData=[];
    $scope.newAvailability=[];
    $scope.availableSlots=[];
    
    //get user info
    if($scope.userType==="doctor"){
        $scope.isDoc=true;
        dataFactory.getDoctorInfo($scope.userId).then(
            function(response){
                $scope.user=response.info;
            },
            function(response){
                console.log("error:"+response);
            }
        );
    }
    else{
        dataFactory.getPatientInfo($scope.userId).then(
            function(response){
                $scope.user=response.info;
            },
            function(response){
                console.log("error:"+response);
            }
        );
    }
    
    //sign out
    $scope.signoutButtonClick = function () {
    appDataService.resetVariableData();
    $window.location.href = './index.html';
    };
    
    //load date data
    var today=new Date();
    $scope.addDays = function(date,days) {
        var dat = new Date(date);
        dat.setDate(date.getDate() + days);
        return dat;
    }
    $scope.processDate=function(date){
        var str=date.getFullYear().toString()+"-";
        if(date.getMonth()+1<10){
            str=str+"0"+(date.getMonth()+1).toString()+"-";
        }
        else{
            str=str+(date.getMonth()+1).toString()+"-";
        }
        if(date.getDate()<10){
            str=str+"0"+date.getDate().toString();
        }
        else{
            str=str+date.getDate().toString();
        }
        return str;
    }
    for(var i=1;i<=14;i++){
        var date=$scope.addDays(today,i);
        if(date.getDay()!=6 && date.getDay()!=0){
            var dateStr=$scope.processDate(date);
            $scope.dateData.push(dateStr);
        }
    }
    
    
    //get available slots
    if($scope.userType="doctor"){
        dataFactory.getDoctorAvailability($scope.userId).then(
            function(response){
                $scope.availableSlots=response.available_slots;
                console.log($scope.availableSlots);
            },
            function(response){
                console.log("error:"+response);
            }
        );
    }
    
    
    //add and delete field methods
    $scope.removeChoice = function(){
        var lastItem = $scope.choices.length-1;
        $scope.choices.splice(lastItem);
    }
    $scope.addNewChoice = function() {
        var newItemNo = $scope.choices.length+1;
        $scope.choices.push({'id':newItemNo,date:"",time:[]});
    };
    
    //post time slots
    
    $scope.submitTimeSlots=function(){
        /*if($scope.choices.length==0){
            
        }*/
        
        //gather data
        for(var i=0;i<$scope.choices.length;i++){
            for(var j=0;j<$scope.choices[i].time.length;j++){
                var slot={
                    date:$scope.choices[i].date,
                    time:$scope.choices[i].time[j].id
                }
                //check overlapping
                /*if(!$scope.availableSlots.includes(slot)){
                    $scope.newAvailability.push(slot);
                }*/
                $scope.newAvailability.push(slot);
            }
        }
        console.log($scope.newAvailability);
        dataFactory.postAvailability($scope.userId,$scope.newAvailability).then(
            function(response){
                console.log("success");
                console.log(response);
                $window.location.reload();
            },
            function(response){
                console.log(response);
            }
        );
        
        
    }
    
}]);

app.filter('futureFilter',function(){
    return function (items){
        var curDate = new Date();
        var array=[];
        for(var i=0; i<items.length;i++){
            //alert(items[i].doctor_id);
            var date=items[i].date;
            //console.log(date);
            var time=items[i].time.substring(0,2);
            //console.log(time);
            var datetime=date+"T"+time+":00:00Z";
            //console.log(datetime);
            var appDate = new Date(datetime);
            //console.log(appDate.toDateString());
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
            var date=items[i].date;
            var time=items[i].time.substring(0,2);
            var datetime=date+"T"+time+":00:00Z";
            var appDate = new Date(datetime);
            if(appDate <= curDate){
                array.push(items[i]);
            }
        }
        return array;
    }
});

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

app.filter('dateFilter',function(){
   return function (item){
       var date=item.split("-");
       var month;
       switch(date[1]) {
            case "01":
                month="Jan"
                break;
            case "02":
                month="Feb"
                break;
            case "03":
                month="Mar"
                break;
            case "04":
                month="Apr"
                break;
            case "05":
                month="May"
                break;
            case "06":
                month="Jun"
                break;
            case "07":
                month="Jul"
                break;
            case "08":
                month="Aug"
                break;
            case "09":
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
        /*if(item<"12"){
            return item+":00 AM";
        }
        else if(item=="12"){
                return item+":00 PM"
                }
        else{
            return item-12+":00 PM"
        }*/
        return item.substring(0,2)+":00"
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