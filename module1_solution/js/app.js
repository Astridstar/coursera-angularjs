( function(){
  'use strict';

  angular.module('LunchCheck', [])
  .controller('LunchCheckController', LunchCheckController);

  function splitString(stringToSplit, separator) {
    var arrayOfStrings = stringToSplit.split(separator);

    //console.log('The original string is: "' + stringToSplit + '"');
    //console.log('The separator is: "' + separator + '"');
    //console.log('The array has ' + arrayOfStrings.length + ' elements: ' + arrayOfStrings.join(' / '));
    return arrayOfStrings;
  }

  LunchCheckController.$inject = ['$scope'];
  function LunchCheckController($scope) {
    $scope.lunchItems = "";
    $scope.messageString = "";
    $scope.messageColorCode = "";

    $scope.checkNumberOfDishes = function(separator){

      // Split the string
      var arrayOfStrings = splitString( $scope.lunchItems, separator);

      // Check the count
      var msgStr = "";
      var msgColor = "";
      var itemCount = 0;

      var i;
      // for (i = 0; i < arrayOfStrings.length; i++) { 
      //   if (arrayOfStrings[i].length > 0){
      //     itemCount++;
      //   }
      //   console.log("Item value:" + arrayOfStrings[i] + " & Item count = " + itemCount );
      // }
      angular.forEach(arrayOfStrings, function(value){
        if (value.length > 0){
          itemCount++;
        }
        //console.log("Item value:" + value + " & Item count = " + itemCount );
      }); 

      console.log("Item count = " + itemCount );

      // update the final message string and color
      if(itemCount > 3){
        msgStr = "Too much!";
        msgColor = "valid_input";
      } else if (itemCount <= 0){
        msgStr = "Please enter data first!!";
        msgColor = "invalid_input";
      } else {
        msgStr = "Enjoy!";
        msgColor = "valid_input";
      }

      $scope.messageString = msgStr;
      $scope.messageColorCode = msgColor;
    };
  }
})();
