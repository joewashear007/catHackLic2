angular.module('app.controllers', [])

.controller('homeCtrl', function($scope) {

})

.controller('blessingsCtrl', function($scope, $ionicModal, $ionicListDelegate) {
  $scope.editItem = {};
  $scope.editId = -1;
  $scope.items = [{
    text: "B1"
  }, {
    text: "B2"
  }, {
    text: "B3"
  }];
  $scope.close = function() {$scope.modal.hide(); }
  $scope.add = function() {
    $scope.editId = -1;
    $scope.modal.show();
  };
  $scope.save = function() {
    if($scope.editId < 0){
      $scope.items.push($scope.editItem);
    }
    $scope.editItem = {};
    $scope.modal.hide();
  }
  $scope.edit = function(id) {
    $scope.editId = id;
    $scope.editItem = $scope.items[id];
    $scope.modal.show();
    $ionicListDelegate.closeOptionButtons();
  }
  $scope.delete = function(id) {
    // TODO: add confirmation?
    $scope.items.splice(id, 1);
  }

  $ionicModal.fromTemplateUrl('my-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(m) {
    $scope.modal = m;
  });
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
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
