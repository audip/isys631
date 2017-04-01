'use strict';

var app = angular.module("myApp", ["ngRoute","ngMaterial","ng-sortable","ngMessages"]);
     
app.service('appDataService', function(){
    var username = '';
    var password = '';
    var searchTerm = "Orthopaedic";
    var searchResult = {
	'success': true,
	'search': [{
						'doctor_id': 3546,
						'photo_url': 'http://www.lolcorps.com/view/image/1445/programmer%20no%20life',
						'name': 'Gaurav Diwanji',
						'qualification': 'ENT Specialist',
						'experience': 5,
						'address': '4302 College Main St. Apt 319, Bryan, Tx - 77801',
						'rating': 3.96
					},
					{
						'doctor_id': 3547,
						'photo_url': 'http://www.lolcorps.com/view/image/1445/programmer%20no%20life',
						'name': 'Lijun Wang',
						'qualification': 'Gyneacologist',
						'experience': 3,
						'address': 'Scnadia, College Station, Tx - 77843',
						'rating': 4.30
					}],
	'error': ''
    };
    
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
    
});

app.factory('dataFactory', ['$http','$q','appDataService', function($http,$q,appDataService) {
    var dataFactory = {};
    
    var restUrl = "https://doctorsforme-api.herokuapp.com"; 
    
    dataFactory.getSearchResult = function (city, type){
        return $http.get(restUrl+'/search/?city='+city+'&type='+type).then(function(response){
            return response.data;})
    };
    
    return dataFactory;
}]);
                
app.config(function($routeProvider) {
        $routeProvider
        .when("/search_results", {
            controller: 'search_resultsCntrl',
            templateUrl : "./partials/search_results.html"
        })
        .otherwise({
            controller: 'search_resultsCntrl',
            templateUrl : "./partials/search_results.html"
        });
    });

app.controller('search_resultsCntrl', ['$scope', '$location','appDataService','dataFactory',function($scope, $location,appDataService,dataFactory) {
    
    $scope.serchTerm = appDataService.getSearchTerm();
    
    $scope.searchResult = appDataService.getSearchResult();
    
    $scope.buttonClick = function () {
    };
    
}]);