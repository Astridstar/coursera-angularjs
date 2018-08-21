( function(){
  'use strict';

  angular.module('ShoppingListCheckOff', [])
  .controller('ToBuyController', ToBuyController)
  .service('ShoppingListCheckOffService', ShoppingListCheckOffService)
  .controller('AlreadyBoughtController', AlreadyBoughtController);

  ToBuyController.$inject = ['ShoppingListCheckOffService'];
  function ToBuyController(ShoppingListCheckOffService) {
    var toBuyControllerObject = this;

    toBuyControllerObject.items = ShoppingListCheckOffService.getToBuyItems();
    toBuyControllerObject.onBoughtEvent = function(itemIndex){
      ShoppingListCheckOffService.boughtItem (itemIndex);
    };

    console.log("To buy controller at startup: ", toBuyControllerObject);
  } /* function ToBuyController */

  AlreadyBoughtController.$inject = ['ShoppingListCheckOffService'];
  function AlreadyBoughtController(ShoppingListCheckOffService) {
    var boughtControllerObject = this;
    boughtControllerObject.boughtItems = ShoppingListCheckOffService.getBoughtItems();
    boughtControllerObject.isBoughtItemsEmpty = ShoppingListCheckOffService.getIsBoughtItemsEmpty();

    console.log("Bought Items at startup: ", boughtControllerObject);
  } /* function AlreadyBoughtController */

  // Service
  function ShoppingListCheckOffService() {
    var service = this;

    // var toBuyItemsList = ["Milk", "Donuts", "Cookies", "Chocolate", "Peanut Butter"];
    var toBuyItemsList = [
      { quantity: "2 cartons", desc: "Milk"},
      { quantity: "5", desc: "Donuts"},
      { quantity: "20 bags", desc: "Cookies"},
      { quantity: "10 boxes", desc: "Chocolate"},
      { quantity: "1 jar", desc: "Peanut Butter"}];

    var boughtItemList = [];
    var isBoughtItemsEmpty = true;

    service.boughtItem = function(itemIndex) {
        // Get item description/label from the toBuyList
        if(itemIndex < 0 || itemIndex >= toBuyItemsList.length ){
          throw new Error("Invalid item given (Item Index: " + itemIndex + ").");
        }

        var theBoughtItem = toBuyItemsList[itemIndex];
        console.log("Item removed: ", theBoughtItem);

        // Remove item from the toBuyItemsList
        toBuyItemsList.splice(itemIndex, 1);

        // Add item to the boughtItemList
        isBoughtItemsEmpty = false;
        boughtItemList.push(theBoughtItem);
        console.log("Bought Items are: ", boughtItemList);
        console.log("Flag Value is : ", isBoughtItemsEmpty);
    };

    service.getToBuyItems = function () {
      return toBuyItemsList;
    };

    service.getBoughtItems = function () {
      return boughtItemList;
    };

    service.getIsBoughtItemsEmpty = function () {
      return isBoughtItemsEmpty;
    };

  }// function ShoppingListCheckOffService() {

})();
