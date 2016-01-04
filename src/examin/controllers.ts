class ExaminCtrl {
  editItem: catHacklic.examin.ExaminItem;
  editId: number;
  items: catHacklic.examin.ExaminItem[];
  modal: ionic.modal.IonicModalController;
  area: string;
  summary: any;

  public static $inject = ["$scope", "ItemService", "$ionicListDelegate", "$ionicModal", "$ionicNavBarDelegate", "$state"];
  constructor(
    private $scope: ng.IScope,
    private itemService: catHacklic.examin.ItemService,
    private $ionicListDelegate: ionic.list.IonicListDelegate,
    private $ionicModal: ionic.modal.IonicModalService,
    private $ionicNavBarDelegate: ionic.navigation.IonicNavBarDelegate,
    private $state: ng.ui.IStateService
    ) {
    $ionicModal.fromTemplateUrl('modal.html', { scope: $scope }).then(m => { this.modal = m; });
    this.area = "blessing";
    this.editItem = {};
    this.editId = -1;
    this.items = itemService.get(this.area);
    $ionicNavBarDelegate.showBackButton(false);
  }

  public select(area: string) {
    console.log("Selected: ", area);
    this.area = area;
    this.items = this.itemService.get(this.area);
    this.summary = this.itemService.summary(['blessing', 'ask', 'kill', 'embrace', 'resolution']);
    console.info(this.summary);
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
  public clear() { this.itemService.clear(); this.summary = this.itemService.summary(); };
  public submit(){
    this.itemService.save();
    this.$state.go('home');
  }
}

angular.module('catHacklic.examin', [])
  .controller('ExaminCtrl', ExaminCtrl)
;
