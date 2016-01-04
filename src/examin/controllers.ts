class BaseExaminCtrl {
  editItem: catHacklic.examin.ExaminItem;
  editId: number;
  items: catHacklic.examin.ExaminItem[];
  modal: ionic.modal.IonicModalController;
  area: string;
  public static $inject = ["$scope" ,"ItemService", "$ionicListDelegate", "$ionicModal"];
  constructor(
    private $scope: ng.IScope,
    private itemService: catHacklic.examin.ItemService,
    private $ionicListDelegate: ionic.list.IonicListDelegate,
    private $ionicModal: ionic.modal.IonicModalService
    ) {
    $ionicModal.fromTemplateUrl(this.area + '.html', { scope: $scope }).then(m => { this.modal = m; });
    this.editItem = {};
    this.editId = -1;
    this.items = itemService.get(this.area);
    console.info(this.items);
  }

  public close() { this.modal.hide(); }
  public add() {
    this.editId = -1;
    this.modal.show();
  }
  public save() {
    console.log(this.editItem, this.area);
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
  public delete(id: number) { this.itemService.delete(this.area, id); };
  public update(id: number) {
    this.items[id].selected = !this.items[id].selected;
    this.itemService.edit(this.area, id, this.items[id]);
  }
}

class BlessingCtrl extends BaseExaminCtrl {
  constructor($scope, itemService, $ionicListDelegate, $ionicModal) {
    this.area = "blessing";
    super($scope, itemService, $ionicListDelegate, $ionicModal);
  }
}

class AskCtrl extends BaseExaminCtrl {
  constructor($scope, itemService, $ionicListDelegate, $ionicModal) {
    this.area = "ask";
    super($scope, itemService, $ionicListDelegate, $ionicModal);
  }
}

class KillCtrl extends BaseExaminCtrl {
  constructor($scope, itemService, $ionicListDelegate, $ionicModal) {
    this.area = "kill";
    super($scope, itemService, $ionicListDelegate, $ionicModal);
  }
}

class EmbraceCtrl extends BaseExaminCtrl {
  constructor($scope,itemService, $ionicListDelegate, $ionicModal) {
    this.area = "embrace";
    super($scope,itemService, $ionicListDelegate, $ionicModal);
  }
}

class ResolutionCtrl extends BaseExaminCtrl {
  constructor($scope,itemService, $ionicListDelegate, $ionicModal) {
    this.area = "resolution";
    super($scope,itemService, $ionicListDelegate, $ionicModal);
  }
}

class ReviewCtrl {
  private summary: any;

  constructor(
    private $scope: ng.IScope,
    private ItemService: catHacklic.examin.ItemService,
    private $state: ng.ui.IStateService
    ) {
    this.summary = ItemService.summary(['blessing', 'ask', 'kill', 'embrace', 'resolution']);
    $scope.$on("ItemService", () => {
      this.summary = ItemService.summary(['blessing', 'ask', 'kill', 'embrace', 'resolution']);
    });
  }
  public save() {
    this.ItemService.save();
    this.$state.go('home');
  };
  public clear() { this.ItemService.clear(); };
}


angular.module('catHacklic.examin', [])
  .controller('BlessingCtrl', BlessingCtrl)
  .controller('AskCtrl', AskCtrl)
  .controller('KillCtrl', KillCtrl)
  .controller('EmbraceCtrl', EmbraceCtrl)
  .controller('KillCtrl', KillCtrl)
  .controller('ReviewCtrl', ReviewCtrl)
;
