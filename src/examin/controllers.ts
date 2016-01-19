class ExaminCtrl {
  public step: number;

  public static $inject = ["$rootScope", "ItemService"];
  constructor(
    private $scope: ng.IRootScopeService,
    private itemService: catHacklic.examin.ItemService
    ) {
    this.step = this.itemService.examStep;
    this.$scope.$on('exam.step', () => this.step = this.itemService.examStep);
  }

  public clear() { this.itemService.clear(); };
}

class ExaminS0Ctrl {
  public static $inject = ['$scope', '$state', '$ionicModal', 'ItemService'];

  public items: catHacklic.examin.todayItem[];
  public helpModal: ionic.modal.IonicModalController;

  constructor(
    private $scope: ng.IScope,
    private $state: ng.ui.IStateService,
    private $ionicModal: ionic.modal.IonicModalService,
    private itemService: catHacklic.examin.ItemService
    ) {
    itemService.todayItems.then(q => this.items = q);
    $ionicModal.fromTemplateUrl('examin-s0-help.html', { scope: $scope }).then(m => this.helpModal = m);
  }

  public done() {
    console.log(this.items.filter(q => q.selected));
    this.itemService.saveTodayItems(this.items);
    this.$state.go('examin.home');
  }
  public help() { this.helpModal.show(); }
  public helpClose() { this.helpModal.hide(); }
}

class ExaminS1Ctrl {
  public static $inject = ['$scope', '$state', '$ionicModal', 'ItemService'];
  public notes: string;
  public helpModal: ionic.modal.IonicModalController;

  constructor(
    private $scope: ng.IScope,
    private $state: ng.ui.IStateService,
    private $ionicModal: ionic.modal.IonicModalService,
    private itemService: catHacklic.examin.ItemService
    ) {
    // itemService.todayItems.then(q => this.items = q);
    $ionicModal.fromTemplateUrl('examin-s1-help.html', { scope: $scope }).then(m => this.helpModal = m);
    this.notes = "";
  }

  public done() {
    this.itemService.saveNote(1, this.notes);
    if (this.itemService.examStep < 2) { this.itemService.next(); }
    this.$state.go('examin.home');
  }

  public help() { this.helpModal.show(); }
  public helpClose() { this.helpModal.hide(); }
}

class ExaminS2Ctrl {
  public static $inject = ['$scope', '$state', '$ionicModal', 'ItemService'];

  public items: catHacklic.examin.item[];
  public allitems: catHacklic.examin.item[];
  public helpModal: ionic.modal.IonicModalController;
  public more: boolean;
  constructor(
    private $scope: ng.IScope,
    private $state: ng.ui.IStateService,
    private $ionicModal: ionic.modal.IonicModalService,
    private itemService: catHacklic.examin.ItemService
    ) {
    itemService.examItems().then(q => this.items = q);
    itemService.examItems(false).then(q => this.allitems = q);
    $ionicModal.fromTemplateUrl('examin-s2-help.html', { scope: $scope }).then(m => this.helpModal = m);
    this.notes = "";
    this.more = false;
  }
  public help() { this.helpModal.show(); }
  public helpClose() { this.helpModal.hide(); }
  public notes: string;

  public done() {
    this.itemService.saveNote(2, this.notes);
    this.itemService.saveExamItems(this.items);
    if (this.itemService.examStep < 3) { this.itemService.next(); }
    this.$state.go('examin.home');
  }
}



class ReviewCtrl {
  summary: catHacklic.examin.summary;

  public static $inject = ["$scope", "$state", "ItemService"];
  constructor(
    private $scope: ng.IScope,
    private $state: ng.ui.IStateService,
    private itemService: catHacklic.examin.ItemService
    ) {
    itemService.summary().then(q => { this.summary = q; });
  }

  public submit() {
    this.itemService.save().then(() => this.$state.go('home'));
  }
}

angular.module('catHacklic.examin', [])
  .controller('ExaminCtrl', ExaminCtrl)
  .controller('ExaminS0Ctrl', ExaminS0Ctrl)
  .controller('ExaminS1Ctrl', ExaminS1Ctrl)
  .controller('ExaminS2Ctrl', ExaminS2Ctrl)
  .controller('ReviewCtrl', ReviewCtrl)
;
