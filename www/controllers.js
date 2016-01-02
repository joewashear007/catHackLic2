var HomeCtrl = (function () {
    function HomeCtrl() {
    }
    return HomeCtrl;
}());
angular.module('catHacklic', [])
    .controller('homeCtrl', HomeCtrl)
    .controller('killCtrl', function ($scope, $controller) {
    $scope.area = 'kill';
    angular.extend(this, $controller('baseExamenCtrl', {
        $scope: $scope
    }));
})
    .controller('embraceCtrl', function ($scope, $controller) {
    $scope.area = 'embrace';
    angular.extend(this, $controller('baseExamenCtrl', {
        $scope: $scope
    }));
})
    .controller('resolutionCtrl', function ($scope, $controller) {
    $scope.area = 'resolution';
    angular.extend(this, $controller('baseExamenCtrl', {
        $scope: $scope
    }));
})
    .controller('reviewCtrl', function ($scope, $state, ItemService) {
    $scope.summary = ItemService.summary(['blessing', 'ask', 'kill', 'embrace', 'resolution']);
    $scope.save = function () {
        ItemService.save();
        $state.go('home');
    };
    $scope.clear = function () {
        ItemService.clear();
    };
    $scope.$on('ItemService', function () {
        $scope.summary = ItemService.summary(['blessing', 'ask', 'kill', 'embrace', 'resolution']);
    });
})
    .controller('historyCtrl', function ($scope) {
})
    .controller('historyItemCtrl', function ($scope) {
});
