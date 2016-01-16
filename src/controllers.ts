class HomeCtrl {
  constructor() { }
}


angular.module('catHacklic')
  .controller('homeCtrl', HomeCtrl)
  .controller('reviewCtrl', function($scope, $state, ItemService) {
  $scope.summary = ItemService.summary(['blessing', 'ask', 'kill', 'embrace', 'resolution']);
  $scope.save = function() {
    ItemService.save();
    $state.go('home');
  };
  $scope.clear = function() {
    ItemService.clear();
  };
  $scope.$on('ItemService', function() {
    $scope.summary = ItemService.summary(['blessing', 'ask', 'kill', 'embrace', 'resolution']);
  });
})

  .controller('historyCtrl', function($scope) {

})

  .controller('historyItemCtrl', function($scope) {

})
