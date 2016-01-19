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

class BaseExaminCtrl {
  public static $inject = ['$scope', '$state', '$ionicModal', 'ItemService'];

  public items: catHacklic.examin.Iitem[];
  public helpModal: ionic.modal.IonicModalController;
  public notes: string;

  protected stepNum: number;

  constructor(
    protected $scope: ng.IScope,
    protected $state: ng.ui.IStateService,
    protected $ionicModal: ionic.modal.IonicModalService,
    protected itemService: catHacklic.examin.ItemService
    ) {
    this.notes = "";
    this.items = [];
    $ionicModal.fromTemplateUrl(`examin-s${this.stepNum}-help.html`, { scope: $scope }).then(m => this.helpModal = m);
  }

  public help() { this.helpModal.show(); }
  public helpClose() { this.helpModal.hide(); }

  public done() {
    this.itemService.saveNote(this.stepNum, this.notes);
    if (this.itemService.examStep <= this.stepNum) { this.itemService.next(); }
    this.$state.go('examin.home');
  }
}

class ExaminS0Ctrl extends BaseExaminCtrl {
  public items: catHacklic.examin.todayItem[];

  constructor($scope, $state, $ionicModal, itemService) {
    this.stepNum = 0;
    super($scope, $state, $ionicModal, itemService);
    this.itemService.todayItems.then(q => this.items = q);
  }

  public done() {
    this.itemService.saveTodayItems(this.items);
    super.done();
  }
}

class ExaminS1Ctrl extends BaseExaminCtrl {
  constructor($scope, $state, $ionicModal, itemService) {
    this.stepNum = 1;
    super($scope, $state, $ionicModal, itemService);
  }
}

class ExaminS2Ctrl extends BaseExaminCtrl{
  public allitems: catHacklic.examin.item[];
  public more: boolean;

  constructor($scope, $state, $ionicModal, itemService) {
    this.stepNum = 2;
    super($scope, $state, $ionicModal, itemService);
    this.itemService.examItems().then(q => this.items = q);
    this.itemService.examItems(false).then(q => this.allitems = q);
    this.more = false;
  }

  public done() {
    this.itemService.saveExamItems(this.items);
    super.done();
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
