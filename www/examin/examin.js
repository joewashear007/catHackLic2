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
var ExaminS0Ctrl = (function () {
    function ExaminS0Ctrl($scope, $state, $ionicModal, itemService) {
        var _this = this;
        this.$scope = $scope;
        this.$state = $state;
        this.$ionicModal = $ionicModal;
        this.itemService = itemService;
        itemService.todayItems.then(function (q) { return _this.items = q; });
        $ionicModal.fromTemplateUrl('examin-s0-help.html', { scope: $scope }).then(function (m) { return _this.helpModal = m; });
    }
    ExaminS0Ctrl.prototype.done = function () {
        console.log(this.items.filter(function (q) { return q.selected; }));
        this.itemService.saveTodayItems(this.items);
        this.$state.go('examin.home');
    };
    ExaminS0Ctrl.prototype.help = function () { this.helpModal.show(); };
    ExaminS0Ctrl.prototype.helpClose = function () { this.helpModal.hide(); };
    ExaminS0Ctrl.$inject = ['$scope', '$state', '$ionicModal', 'ItemService'];
    return ExaminS0Ctrl;
}());
var ExaminS1Ctrl = (function () {
    function ExaminS1Ctrl($scope, $state, $ionicModal, itemService) {
        var _this = this;
        this.$scope = $scope;
        this.$state = $state;
        this.$ionicModal = $ionicModal;
        this.itemService = itemService;
        $ionicModal.fromTemplateUrl('examin-s1-help.html', { scope: $scope }).then(function (m) { return _this.helpModal = m; });
        this.notes = "";
    }
    ExaminS1Ctrl.prototype.done = function () {
        this.itemService.saveNote(1, this.notes);
        if (this.itemService.examStep < 2) {
            this.itemService.next();
        }
        this.$state.go('examin.home');
    };
    ExaminS1Ctrl.prototype.help = function () { this.helpModal.show(); };
    ExaminS1Ctrl.prototype.helpClose = function () { this.helpModal.hide(); };
    ExaminS1Ctrl.$inject = ['$scope', '$state', '$ionicModal', 'ItemService'];
    return ExaminS1Ctrl;
}());
var ExaminS2Ctrl = (function () {
    function ExaminS2Ctrl($scope, $state, $ionicModal, itemService) {
        var _this = this;
        this.$scope = $scope;
        this.$state = $state;
        this.$ionicModal = $ionicModal;
        this.itemService = itemService;
        itemService.examItems().then(function (q) { return _this.items = q; });
        itemService.examItems(false).then(function (q) { return _this.allitems = q; });
        $ionicModal.fromTemplateUrl('examin-s2-help.html', { scope: $scope }).then(function (m) { return _this.helpModal = m; });
        this.notes = "";
        this.more = false;
    }
    ExaminS2Ctrl.prototype.help = function () { this.helpModal.show(); };
    ExaminS2Ctrl.prototype.helpClose = function () { this.helpModal.hide(); };
    ExaminS2Ctrl.prototype.done = function () {
        this.itemService.saveNote(2, this.notes);
        this.itemService.saveExamItems(this.items);
        if (this.itemService.examStep < 3) {
            this.itemService.next();
        }
        this.$state.go('examin.home');
    };
    ExaminS2Ctrl.$inject = ['$scope', '$state', '$ionicModal', 'ItemService'];
    return ExaminS2Ctrl;
}());
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
