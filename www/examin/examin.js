var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ExaminCtrl = (function () {
    function ExaminCtrl($scope, itemService) {
        var _this = this;
        this.$scope = $scope;
        this.itemService = itemService;
        this.step = this.itemService.examStep;
        this.$scope.$on('exam.step', function () { return _this.step = _this.itemService.examStep; });
    }
    ExaminCtrl.prototype.clear = function () { this.itemService.clear(); };
    ;
    ExaminCtrl.$inject = ["$rootScope", "ItemService"];
    return ExaminCtrl;
}());
var BaseExaminCtrl = (function () {
    function BaseExaminCtrl($scope, $state, $ionicModal, itemService) {
        var _this = this;
        this.$scope = $scope;
        this.$state = $state;
        this.$ionicModal = $ionicModal;
        this.itemService = itemService;
        this.items = [];
        console.log("Loading Ctrl: " + this.stepNum);
        $ionicModal.fromTemplateUrl("examin-s" + this.stepNum + "-help.html", { scope: $scope }).then(function (m) { return _this.helpModal = m; });
        itemService.getNote(this.stepNum).then(function (q) { return _this.notes = q; });
    }
    BaseExaminCtrl.prototype.help = function () { this.helpModal.show(); };
    BaseExaminCtrl.prototype.helpClose = function () { this.helpModal.hide(); };
    BaseExaminCtrl.prototype.done = function () {
        this.itemService.saveNote(this.stepNum, this.notes);
        if (this.itemService.examStep <= this.stepNum) {
            this.itemService.next();
        }
        this.$state.go('examin.home');
    };
    BaseExaminCtrl.$inject = ['$scope', '$state', '$ionicModal', 'ItemService'];
    return BaseExaminCtrl;
}());
var ExaminS0Ctrl = (function (_super) {
    __extends(ExaminS0Ctrl, _super);
    function ExaminS0Ctrl($scope, $state, $ionicModal, itemService) {
        var _this = this;
        this.stepNum = 0;
        _super.call(this, $scope, $state, $ionicModal, itemService);
        this.itemService.todayItems.then(function (q) { return _this.items = q; });
    }
    ExaminS0Ctrl.prototype.done = function () {
        this.itemService.saveTodayItems(this.items);
        _super.prototype.done.call(this);
    };
    return ExaminS0Ctrl;
}(BaseExaminCtrl));
var ExaminS1Ctrl = (function (_super) {
    __extends(ExaminS1Ctrl, _super);
    function ExaminS1Ctrl($scope, $state, $ionicModal, itemService) {
        this.stepNum = 1;
        _super.call(this, $scope, $state, $ionicModal, itemService);
    }
    return ExaminS1Ctrl;
}(BaseExaminCtrl));
var ExaminS2Ctrl = (function (_super) {
    __extends(ExaminS2Ctrl, _super);
    function ExaminS2Ctrl($scope, $state, $ionicModal, itemService) {
        var _this = this;
        this.stepNum = 2;
        _super.call(this, $scope, $state, $ionicModal, itemService);
        this.itemService.examItems().then(function (q) { return _this.items = q; });
        this.itemService.examItems(false).then(function (q) { return _this.allitems = q; });
        this.more = false;
    }
    ExaminS2Ctrl.prototype.done = function () {
        this.itemService.saveExamItems(this.items);
        _super.prototype.done.call(this);
    };
    return ExaminS2Ctrl;
}(BaseExaminCtrl));
var ExaminS3Ctrl = (function (_super) {
    __extends(ExaminS3Ctrl, _super);
    function ExaminS3Ctrl($scope, $state, $ionicModal, itemService) {
        this.stepNum = 3;
        _super.call(this, $scope, $state, $ionicModal, itemService);
    }
    return ExaminS3Ctrl;
}(BaseExaminCtrl));
var ExaminS4Ctrl = (function (_super) {
    __extends(ExaminS4Ctrl, _super);
    function ExaminS4Ctrl($scope, $state, $ionicModal, itemService) {
        this.stepNum = 4;
        _super.call(this, $scope, $state, $ionicModal, itemService);
    }
    return ExaminS4Ctrl;
}(BaseExaminCtrl));
var ExaminS5Ctrl = (function (_super) {
    __extends(ExaminS5Ctrl, _super);
    function ExaminS5Ctrl($scope, $state, $ionicModal, itemService) {
        this.stepNum = 5;
        _super.call(this, $scope, $state, $ionicModal, itemService);
    }
    return ExaminS5Ctrl;
}(BaseExaminCtrl));
var ExaminS6Ctrl = (function (_super) {
    __extends(ExaminS6Ctrl, _super);
    function ExaminS6Ctrl($scope, $state, $ionicModal, itemService) {
        this.stepNum = 6;
        _super.call(this, $scope, $state, $ionicModal, itemService);
    }
    return ExaminS6Ctrl;
}(BaseExaminCtrl));
var ExaminS7Ctrl = (function (_super) {
    __extends(ExaminS7Ctrl, _super);
    function ExaminS7Ctrl($scope, $state, $ionicModal, itemService) {
        this.stepNum = 7;
        _super.call(this, $scope, $state, $ionicModal, itemService);
    }
    return ExaminS7Ctrl;
}(BaseExaminCtrl));
var ReviewCtrl = (function () {
    function ReviewCtrl($scope, $state, itemService) {
        var _this = this;
        this.$scope = $scope;
        this.$state = $state;
        this.itemService = itemService;
        itemService.summary().then(function (q) { _this.summary = q; });
    }
    ReviewCtrl.prototype.submit = function () {
        var _this = this;
        this.itemService.save().then(function () { return _this.$state.go('home'); });
    };
    ReviewCtrl.$inject = ["$scope", "$state", "ItemService"];
    return ReviewCtrl;
}());
angular.module('catHacklic.examin', [])
    .controller('ExaminCtrl', ExaminCtrl)
    .controller('ExaminS0Ctrl', ExaminS0Ctrl)
    .controller('ExaminS1Ctrl', ExaminS1Ctrl)
    .controller('ExaminS2Ctrl', ExaminS2Ctrl)
    .controller('ExaminS3Ctrl', ExaminS3Ctrl)
    .controller('ExaminS4Ctrl', ExaminS4Ctrl)
    .controller('ExaminS5Ctrl', ExaminS5Ctrl)
    .controller('ExaminS6Ctrl', ExaminS6Ctrl)
    .controller('ExaminS7Ctrl', ExaminS7Ctrl)
    .controller('ReviewCtrl', ReviewCtrl);


var catHacklic;
(function (catHacklic) {
    var examin;
    (function (examin) {
        var ItemService = (function () {
            function ItemService($rootScope, $q, $http, UserSerivce) {
                this.$rootScope = $rootScope;
                this.$q = $q;
                this.$http = $http;
                this.UserSerivce = UserSerivce;
                this._loadData();
                this._examStep = 0;
            }
            ItemService.prototype._loadData = function () {
                if (typeof this._loadedData === "undefined") {
                    var defer = this.$q.defer();
                    var loadConfigItems = this.$q.when(JSON.parse(localStorage['v1.exam.userConfig'] || '[]'));
                    var loadTodayJson = this.$http.get('examin/data/todayItems.json').then(function (q) { return q.data; });
                    var loadedTodayItems = this.$q.all([loadConfigItems, loadTodayJson]).then(function (items) {
                        items[0].forEach(function (w) { return items[1].filter(function (p) { return p.text == w.text; })[0].selected = w.selected; });
                        items[1].filter(function (q) { return q.condition == "sunday"; })[0].selected = (new Date()).getDay() == 0;
                        return items[1];
                    });
                    var loadCustomItems = this.$q.when(JSON.parse(localStorage['v1.exam.items'] || '[]'));
                    var loadJson = this.$http.get('examin/data/questions.json').then(function (q) { return q.data; });
                    var loadedItems = this.$q.all([loadJson, loadCustomItems]).then(function (items) { return items[0].concat(items[1]); });
                    this._loadedData = this.$q.all([loadedItems, loadedTodayItems]).then(function (results) {
                        return {
                            items: results[0],
                            today: results[1],
                            notes: []
                        };
                    });
                }
                return this._loadedData;
            };
            Object.defineProperty(ItemService.prototype, "data", {
                get: function () { return this._loadedData; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ItemService.prototype, "examStep", {
                get: function () { return this._examStep; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ItemService.prototype, "todayItems", {
                get: function () {
                    return this.data.then(function (q) { return q.today.filter(function (w) { return w.show; }); });
                },
                enumerable: true,
                configurable: true
            });
            ItemService.prototype.examItems = function (shown) {
                if (typeof shown === "undefined") {
                    shown = true;
                }
                return this._filterExamItems().then(function (q) { return q.items.filter(function (w) { return w.shown == shown; }); });
            };
            ItemService.prototype.saveExamItems = function (items) {
            };
            ItemService.prototype.saveTodayItems = function (items) {
                if (this._examStep == 0) {
                    this.next();
                }
            };
            ItemService.prototype.saveNote = function (id, note) {
                return this.data.then(function (d) { d.notes[id] = note; return d.notes; });
            };
            ItemService.prototype.getNote = function (id) {
                return this.data.then(function (d) { return d.notes[id]; });
            };
            ItemService.prototype.next = function () {
                this._examStep++;
                this.$rootScope.$emit('exam.step');
            };
            ItemService.prototype._filterExamItems = function () {
                return this.data.then(function (q) {
                    q.items.forEach(function (w) {
                        var conditionMet = false;
                        w.condition = w.condition || "";
                        if (w.condition != "") {
                            var conditions = w.condition.split(',');
                            conditionMet = q.today.some(function (p) { return p.selected && conditions.indexOf(p.condition) > -1; });
                        }
                        w.shown = w.common > 0 || conditionMet;
                    });
                    return q;
                });
            };
            ItemService.prototype.save = function () {
                console.warn("NOT IMPLEMENTED");
                return this.data;
            };
            ItemService.prototype.clear = function () {
                return this.data.then(function (q) {
                    q.items.forEach(function (w) { return w.selected = false; });
                    q.today.forEach(function (w) { return w.selected = false; });
                    return q;
                });
            };
            ItemService.prototype.summary = function () {
                return this.data.then(function (d) {
                    console.log("Summary!", d.notes);
                    var summary = [];
                    var todayItemsSummary = [];
                    d.today.forEach(function (q) { if (q.selected) {
                        todayItemsSummary.push({ text: q.text, });
                    } });
                    var awarnessItems = [];
                    d.items.forEach(function (q) { if (q.selected) {
                        todayItemsSummary.push({ text: q.text, });
                    } });
                    summary.push({ note: d.notes[0], items: todayItemsSummary });
                    summary.push({ note: d.notes[1], items: [] });
                    summary.push({ note: d.notes[2], items: awarnessItems });
                    summary.push({ note: d.notes[3], items: [] });
                    summary.push({ note: d.notes[4], items: [] });
                    summary.push({ note: d.notes[5], items: [] });
                    summary.push({ note: d.notes[6], items: [] });
                    summary.push({ note: d.notes[7], items: [] });
                    return summary;
                });
            };
            ItemService.$inject = ["$rootScope", "$q", "$http", "UserSerivce"];
            return ItemService;
        }());
        examin.ItemService = ItemService;
    })(examin = catHacklic.examin || (catHacklic.examin = {}));
})(catHacklic || (catHacklic = {}));
angular.module('catHacklic.examin')
    .service('ItemService', catHacklic.examin.ItemService);

var starter = [];
