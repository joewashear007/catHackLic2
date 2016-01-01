"use strict";
var HomeCtrl = (function () {
    function HomeCtrl() {
    }
    return HomeCtrl;
})();
var BaseExaminCtrl = (function () {
    function BaseExaminCtrl(itemService, $ionicListDelegate) {
        this.itemService = itemService;
        this.$ionicListDelegate = $ionicListDelegate;
        this.editItem = {};
        this.editId = -1;
    }
    BaseExaminCtrl.prototype.close = function () { this.modal.hide(); };
    BaseExaminCtrl.prototype.add = function () {
        this.editId = -1;
        this.modal.show();
    };
    BaseExaminCtrl.prototype.save = function () {
        if (this.editId < 0) {
            this.editItem.selected = true;
            this.itemService.add(this.area, this.editItem);
        }
        else {
            this.itemService.edit(this.area, this.editId, this.editItem);
        }
        this.editItem = {};
        this.modal.hide();
    };
    BaseExaminCtrl.prototype.edit = function (id) {
        this.editId = id;
        this.editItem = this.items[id];
        this.modal.show();
        this.$ionicListDelegate.closeOptionButtons();
    };
    BaseExaminCtrl.prototype.delete = function (id) {
        this.itemService.delete(this.area, id);
    };
    ;
    BaseExaminCtrl.prototype.update = function (id) {
        this.items[id].selected = !this.items[id].selected;
        this.itemService.edit(this.area, id, this.items[id]);
    };
    return BaseExaminCtrl;
})();
angular.module('app.controllers', [])
    .controller('homeCtrl', HomeCtrl)
    .controller('baseExamenCtrl', function ($scope, $ionicModal, $ionicListDelegate, ItemService) {
    $scope.editItem = {};
    $scope.editId = -1;
    $scope.items = ItemService.get($scope.area);
    $scope.$on('ItemService', function (event, name) {
        if (name == $scope.area) {
            $scope.items = ItemService.get($scope.area);
        }
    });
    $scope.close = function () {
        $scope.modal.hide();
    };
    $scope.add = function () {
        $scope.editId = -1;
        $scope.modal.show();
    };
    $scope.save = function () {
        if ($scope.editId < 0) {
            $scope.editItem.selected = true;
            ItemService.add($scope.area, $scope.editItem);
        }
        else {
            ItemService.edit($scope.area, $scope.editId, $scope.editItem);
        }
        $scope.editItem = {};
        $scope.modal.hide();
    };
    $scope.edit = function (id) {
        $scope.editId = id;
        $scope.editItem = $scope.items[id];
        $scope.modal.show();
        $ionicListDelegate.closeOptionButtons();
    };
    $scope.delete = function (id) {
        ItemService.delete($scope.area, id);
    };
    $scope.update = function (id) {
        $scope.items[id].selected = !$scope.items[id].selected;
        ItemService.edit($scope.area, id, $scope.items[id]);
    };
    $ionicModal.fromTemplateUrl($scope.area + '.html', {
        scope: $scope,
    }).then(function (m) {
        $scope.modal = m;
    });
    $scope.$on('$destroy', function () {
        $scope.modal.remove();
        ItemService.save();
    });
})
    .controller('blessingsCtrl', function ($scope, $controller) {
    $scope.area = 'blessing';
    angular.extend(this, $controller('baseExamenCtrl', {
        $scope: $scope
    }));
})
    .controller('askCtrl', function ($scope, $controller) {
    $scope.area = 'ask';
    angular.extend(this, $controller('baseExamenCtrl', {
        $scope: $scope
    }));
})
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
