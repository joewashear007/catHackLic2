import ItemService from "./services";
class HomeCtrl {
  constructor() { }
}

class BaseExaminCtrl {
  editItem: catHacklic.ExaminItem;
  editId: number;
  items: catHacklic.ExaminItem[];
  modal: ionic.modal.IonicModalController;
  area: string;

  constructor(public itemService: ItemService, private $ionicListDelegate: ionic.list.IonicListDelegate) {
    this.editItem = {};
    this.editId = -1;
  }

  public close() { this.modal.hide(); }
  public add() {
    this.editId = -1;
    this.modal.show();
  }
  public save () {
    if (this.editId < 0) {
      this.editItem.selected = true;
      this.itemService.add(this.area, this.editItem);
    } else {
      this.itemService.edit(this.area, this.editId, this.editItem);
    }
    this.editItem = {};
    this.modal.hide();
  }
  public edit(id: number) {
    this.editId = id;
    this.editItem = this.items[id];
    this.modal.show();
    this.$ionicListDelegate.closeOptionButtons();
  }
  public delete(id: number) {
    this.itemService.delete(this.area, id);
  };
  public update(id: number) {
    this.items[id].selected = !this.items[id].selected;
    this.itemService.edit(this.area, id, this.items[id]);
  }
}

angular.module('app.controllers', [])
  .controller('homeCtrl', HomeCtrl)

  .controller('baseExamenCtrl', function($scope, $ionicModal, $ionicListDelegate, ItemService) {
  $scope.editItem = {};
  $scope.editId = -1;
  $scope.items = ItemService.get($scope.area);
  $scope.$on('ItemService', function(event, name) {
    if (name == $scope.area) {
      $scope.items = ItemService.get($scope.area);
    }
  });
  $scope.close = function() {
    $scope.modal.hide();
  }
  $scope.add = function() {
    $scope.editId = -1;
    $scope.modal.show();
  };
  $scope.save = function() {
    if ($scope.editId < 0) {
      $scope.editItem.selected = true;
      ItemService.add($scope.area, $scope.editItem);
    } else {
      ItemService.edit($scope.area, $scope.editId, $scope.editItem);
    }
    $scope.editItem = {};
    $scope.modal.hide();
  };
  $scope.edit = function(id) {
    $scope.editId = id;
    $scope.editItem = $scope.items[id];
    $scope.modal.show();
    $ionicListDelegate.closeOptionButtons();
  };
  $scope.delete = function(id) {
    ItemService.delete($scope.area, id);
  };
  $scope.update = function(id) {
    $scope.items[id].selected = !$scope.items[id].selected;
    ItemService.edit($scope.area, id, $scope.items[id]);
  }
  $ionicModal.fromTemplateUrl($scope.area + '.html', {
    scope: $scope,
  }).then(function(m) {
    $scope.modal = m;
  });
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
    ItemService.save();
  });
})

  .controller('blessingsCtrl', function($scope, $controller) {
  $scope.area = 'blessing';
  angular.extend(this, $controller('baseExamenCtrl', {
    $scope: $scope
  }));
})
  .controller('askCtrl', function($scope, $controller) {
  $scope.area = 'ask';
  angular.extend(this, $controller('baseExamenCtrl', {
    $scope: $scope
  }));
})

  .controller('killCtrl', function($scope, $controller) {
  $scope.area = 'kill';
  angular.extend(this, $controller('baseExamenCtrl', {
    $scope: $scope
  }));
})

  .controller('embraceCtrl', function($scope, $controller) {
  $scope.area = 'embrace';
  angular.extend(this, $controller('baseExamenCtrl', {
    $scope: $scope
  }));
})

  .controller('resolutionCtrl', function($scope, $controller) {
  $scope.area = 'resolution';
  angular.extend(this, $controller('baseExamenCtrl', {
    $scope: $scope
  }));
})
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
