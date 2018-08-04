( function(){
  'use strict';

  angular.module('LunchCheck', [])
  .controller('LunchCheckController', LunchCheckController);

  function splitString(stringToSplit, separator) {
    return stringToSplit.split(separator);
  }

  LunchCheckController.$inject = ['$scope'];
  function LunchCheckController($scope) {
    $scope.lunchItems = "";
    $scope.messageString = "";
    $scope.messageClass = "";

    $scope.checkNumberOfDishes = function(separator, cssValidInputClassName, cssInvalidInputClassName){/*,
                                          validNumOfDishMsg, invalidNumOfDishMsg, invalidEntryMsg){*/

      // Split the string
      var arrayOfStrings = splitString( $scope.lunchItems, separator);

      // Check the count and make sure that empty strings or strings 
      // that only contains spaces are not considered as part of the 
      // item counts
      var itemCount = 0;
      angular.forEach(arrayOfStrings, function(value){
        if (value.trim().length > 0){
          itemCount++;
        }
      }); 

      // update the final message string and color
      // by deciding on the appropriate html classes to add
      var msgStr = "";
      var msgColor = "";
      if(itemCount > 3){
        msgStr = "Too much!";
        msgColor = cssValidInputClassName;
      } else if (itemCount <= 0){
        msgStr = "Please enter data first!!";
        msgColor = cssInvalidInputClassName;
      } else {
        msgStr = "Enjoy!";
        msgColor = cssValidInputClassName;
      }

      $scope.messageString = msgStr;
      $scope.messageClass = msgColor;
    };
  }
})();
