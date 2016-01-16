class ExaminCtrl {
  editItem: catHacklic.examin.item;
  editId: number;
  items: catHacklic.examin.item[];
  modal: ionic.modal.IonicModalController;
  area: string;
  summary: any;
  baseExam: catHacklic.examin.item[];

  public static $inject = ["$scope", "ItemService", "$ionicListDelegate", "$ionicModal", "$state"];
  constructor(
    private $scope: ng.IScope,
    private itemService: catHacklic.examin.ItemService,
    private $ionicListDelegate: ionic.list.IonicListDelegate,
    private $ionicModal: ionic.modal.IonicModalService,
    private $state: ng.ui.IStateService
    ) {
    $ionicModal.fromTemplateUrl('modal.html', { scope: $scope }).then(m => { this.modal = m; });
    this.area = "blessing";
    this.editItem = {text: "", common: 0, id:1000};
    this.editId = -1;
    this.items = itemService.get(this.area);
    itemService.BasicExam().then(d => this.baseExam = d);
  }

  public select(area: string) {
    console.log("Selected: ", area);
    if (area == "summary") {
      this.summary = this.itemService.summary();
      console.info(this.summary);
    } else {
      this.area = area;
      this.items = this.itemService.get(this.area);
    }
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
    this.editItem = { text: "", id: 1001, common: 0};
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
  public clear() { this.itemService.clear(); };
  public reset() { this.itemService.reset(); this.items = this.itemService.get(this.area);   }
}

class ReviewCtrl {
  summary: any;

  public static $inject = ["$scope", "ItemService", "$ionicListDelegate", "$ionicModal", "$state"];
  constructor(
    private $scope: ng.IScope,
    private itemService: catHacklic.examin.ItemService,
    private $ionicListDelegate: ionic.list.IonicListDelegate,
    private $ionicModal: ionic.modal.IonicModalService,
    private $state: ng.ui.IStateService
    ) {
    this.summary = itemService.summary();
  }

  public submit() {
    this.itemService.save();
    this.$state.go('home');
  }
}

angular.module('catHacklic.examin', [])
  .controller('ExaminCtrl', ExaminCtrl)
  .controller('ReviewCtrl', ReviewCtrl)
;
