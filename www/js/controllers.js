angular.module('app.controllers', [])

.controller('homeCtrl', function($scope) {

})

.controller('blessingsCtrl', function($scope) {
  $scope.items = [{text:"B1"}, {text:"B2"}, {text:"B3"}];
  $scope.add = function() {
    $scope.items.push({text: "newItem" + $scope.items.length});
  };
  $scope.edit = function(id) {

  }
  $scope.delete = function(id) {
    $scope.items.splice(id, 1);
  }
})

.controller('askCtrl', function($scope) {

})

.controller('killCtrl', function($scope) {

})

.controller('embraceCtrl', function($scope) {

})

.controller('resolutionCtrl', function($scope) {

})

.controller('reviewCtrl', function($scope) {

})

.controller('historyCtrl', function($scope) {

})

.controller('historyItemCtrl', function($scope) {

})
