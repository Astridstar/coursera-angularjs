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
      isSearching: '<',
      onRemove: '&'
    },
    controller: DisplayContentController,
    controllerAs: 'display',
    bindToController: true,
    link: DisplayContentLink,
    templateUrl: 'content-template.html'
  };
  return ddo;
} // function DisplayContent()

function DisplayContentController(){
  var self = this;
}; // function DisplayContentController()

function DisplayContentLink(scope, element, attrs, controller) {
  console.log("DisplayContentLink");
  //element.find('div').css('display', 'block');

  scope.$watch('display.isSearching', function (newValue, oldValue) {
    console.log("Old value: ", oldValue);
    console.log("New value: ", newValue);
    if (newValue == true) {
      element.find('div').css('display', 'block');
    }
    else {
      element.find('div').css('display', 'none');
    }
  });

  function enableLoader(toShow){
    element.find('div').css('display', (toShow === true ? 'block' : 'none'));
  }
};

NarrowItDownController.$inject = ['$scope', 'MenuSearchService'];
function NarrowItDownController($scope, MenuSearchService) {
  var self = this;
  var userInput = '';
  var found = [];
  var isSearching = 0;

  self.getMatchedMenuItems = function(searchTerm){
    self.isSearching = 1;
    //console.log("getMatchedMenuItems triggered");
    var promise = MenuSearchService.getMatchedMenuItems(searchTerm);
    promise.then(function(response){
      //console.log("Response added to promise: ");
      //console.log(promise.found);
      self.found = promise.found;
      self.isSearching = 0;
    })
    .catch(function (error) {
      console.log("Something went terribly wrong.");
      self.isSearching = 0;
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
    var promise = self.retrieveMenuItems();
    promise.then(function (response) {
      promise.found = self.search(searchTerm, response.data.menu_items);
    })
    .catch(function (error) {
      console.log("Something went terribly wrong.");
    });
    return promise;
  };

  self.search = function(searchTerm, menuItems){
    var matchingItems = [];
    if( menuItems !== undefined){
      for(var i = 0; i < menuItems.length; i++){
        if(menuItems[i].description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1){
          matchingItems.push(menuItems[i]);
        }
      }
    }
    return matchingItems;
  };
} // function MenuSearchService($http, ApiBasePath)
})(); // ( function(){ IIFE
