(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.directive('foundItems', DisplayContent)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");

function DisplayContent(){
  var ddo = {
    restrict: 'E',
    scope: {
      title: '@',
      onFound: '<',
      onRemove: '&'
    },
    controller: DisplayContentController,
    controllerAs: 'display',
    bindToController: true,
    //link: DisplayContentLink,
    templateUrl: 'content-template.html'
  };
  return ddo;
} // function DisplayContent()

function DisplayContentController(){
  var self = this;
}; // function DisplayContentController()

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var self = this;
  var userInput = '';
  var found = [];

  self.getMatchedMenuItems = function(searchTerm){
    console.log("getMatchedMenuItems triggered");
    var promise = MenuSearchService.getMatchedMenuItems(searchTerm);
    promise.then(function(response){
      console.log("Response added to promise: ");
      console.log(promise.found);
      self.found = promise.found;
    });
  };

  self.removeItem = function(index){
    found.splice(index, 1);
  };
} // function NarrowItDownController(MenuSearchService)

MenuSearchService.$inject = ['$http', 'ApiBasePath'];
function MenuSearchService($http, ApiBasePath) {
  var self = this;

  self.retrieveMenuItems = function () {
    var response = $http({
      method: "GET",
      url: (ApiBasePath + "/menu_items.json")
    });

    return response;
  };

  self.getMatchedMenuItems = function(searchTerm){
    console.log("Service - SearchTerm = " + searchTerm);

    var promise = self.retrieveMenuItems();

    promise.then(function (response) {
      //console.log("Unfiltered Response received: ");
      //console.log(response.data);

      promise.found = self.search(searchTerm, response.data.menu_items);
      //console.log("Response added to promise: ");
      //console.log(promise.found);
    })
    .catch(function (error) {
      console.log("Something went terribly wrong.");
    });
    return promise;
  };

  self.search = function(searchTerm, menuItems){
    //console.log("SearchTerm = " + searchTerm + " & MenuItems = " + menuItems);
    var matchingItems = [];
    if( menuItems !== undefined){
      for(var i = 0; i < menuItems.length; i++){
        if(menuItems[i].description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1){
          matchingItems.push(menuItems[i]);
        }
      }
    }
    //console.log("Items matching => " + searchTerm);
    //console.log(matchingItems);
    return matchingItems;
  };
} // function MenuSearchService($http, ApiBasePath)
})(); // ( function(){ IIFE
