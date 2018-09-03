(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.directive('foundItems', DisplayContent)
.constant('SearchResultMessage', "Nothing found.")
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
  scope.$watch('display.isSearching', function (newValue, oldValue) {
    //console.log("Old value: ", oldValue);
    //console.log("New value: ", newValue);
    if (newValue == true) {
      element.find('div.loader').css('display', 'inline-block');
      element.find('div.searchContent').css('display', 'none');
    }
    else {
      element.find('div.loader').css('display', 'none');
      element.find('div.searchContent').css('display', 'inline-block');
    }
  });

  function enableLoader(toShow){
    element.find('div').css('display', (toShow === true ? 'block' : 'none'));
  }
};

NarrowItDownController.$inject = ['$scope', 'MenuSearchService', 'SearchResultMessage'];
function NarrowItDownController($scope, MenuSearchService, SearchResultMessage) {
  var self = this;
  var userInput = '';
  var found = [];
  var isSearching = 0;
  var message = '';

  self.getMatchedMenuItems = function(searchTerm){
    self.message = '';

    if(self.found !== undefined && self.found.length !== 0){
        self.found = [];
    }
    if(searchTerm == undefined || searchTerm === ''){
      self.message = SearchResultMessage;
      return;
    }

    self.isSearching = 1;
    var promise = MenuSearchService.getMatchedMenuItems(searchTerm);
    promise.then(function(response){
      self.found = promise.found;
      self.isSearching = 0;
      if(self.found === undefined || self.found.length === 0){
        self.message = SearchResultMessage;
      }
    })
    .catch(function (error) {
      console.log("Something went terribly wrong.");
      self.isSearching = 0;
      self.message = SearchResultMessage;
    });
  };

  self.removeItem = function(index){
    console.log("Removed item : ");
    console.log(self.found[index]);
    self.found.splice(index, 1);
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
