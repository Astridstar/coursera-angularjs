( function(){
  'use strict';

  angular.module('NarrowItDownApp', [])
  .controller('NarrowItDownController', NarrowItDownController)
  .service('menuSearchService', MenuSearchService)
  .directive('foundItems', FoundItemsDirective)
  .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");

// directive
  function FoundItemsDirective(){
    var ddo = {
      restrict: 'E',
      scope:{
          found: '<',
          onRemove: '&'
      },
      transclude: true,
      controller: FoundItemsDirectiveController,
      controllerAs: 'controller',
      templateUrl: "loader/itemsloaderindicator.template.html"
    };
    return ddo;
  };

  function FoundItemsDirectiveController(){
    var controller = this;

    controller.hasFoundItems = function(){
      // if( (controller.foundItems === undefined) || (controller.foundItems.length <= 0 ){
      //   return false;
      // };
      return true;
    };
  };

// Controller
  NarrowItDownController.$inject = ['menuSearchService'];
  function NarrowItDownController(menuSearchService){
    var controller = this;
    var found = [];
    var searchTerm = '';

    controller.found = menuSearchService.getFoundItems;
    controller.getMatchedMenuItems = function(searchTerm){
      controller.found = menuSearchService.getMatchedMenuItems(searchTerm);
      console.log(this);
      console.log("Matching items: ");
      console.log(controller.found);
    };

    controller.removeItem = function(itemIndex){
      menuSearchService.removeItem(itemIndex);
    };
  };

// Service
  MenuSearchService.$inject = ['$http', 'ApiBasePath'];
  function MenuSearchService($http, ApiBasePath){
    var service = this;
    var foundItems = [];

    // Async executing of fetching from the server
    service.getMenuItems = function(){
      var response = $http({
        method: "GET",
        url: (ApiBasePath + "/menu_items.json")
      });
      return response;
    };

    // Modifiers
    service.removeItem = function (itemIndex){
      foundItems.splice(itemIndex, 1);
    };

    service.getFoundItems = function(){
      return foundItems;
    };

    service.getMatchedMenuItems = function(searchTerm){
      console.log("Searching for text: " +  searchTerm.toLowerCase() );
      var promise = service.getMenuItems();

      service.foundItems = promise.then( function(response, service){
        var foundItems = [];
        //console.log("Successful retrieve: ");
        //console.log(response.data);
        if(response.data.menu_items === undefined )
          throw new Error("Menu_items are invalid");
        // search the results to that matches searchTerm
        for (var i = 0; i < response.data.menu_items.length; i++) {
          var item = response.data.menu_items[i];
          //console.log("Description: "+ item.description.toLowerCase());
          if(item.description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1)
            foundItems.push(item);
        }
        //console.log("Matching items: ");
        //console.log(foundItems);
        console.log("No of matching items found: " + foundItems.length);
        console.log(this);
        return foundItems;
      })
      .catch(function(error) {
        // Process any error functions
        console.log("Error caught while executing search: " + error)
      });

      console.log("In service: getMatchedMenuItems. Found items:---------------");
      console.log(service.foundItems);
      console.log(service.foundItems.value);
    };
  }; //function MenuSearchService($http, ApiBasePath){

})(); // ( function(){ IIFE
