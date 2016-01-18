var ExaminCtrl = (function () {
    function ExaminCtrl($scope, itemService) {
        var _this = this;
        this.$scope = $scope;
        this.itemService = itemService;
        this.step = 0;
        this.$scope.$on('exam.step', function () { return _this.step = _this.itemService.examStep; });
    }
    ExaminCtrl.prototype.clear = function () { this.itemService.clear(); };
    ;
    ExaminCtrl.prototype.reset = function () { this.itemService.reset(); };
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
        this.freeInput = "";
    }
    ExaminS1Ctrl.prototype.done = function () {
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
var ReviewCtrl = (function () {
    function ReviewCtrl($scope, itemService, $ionicListDelegate, $ionicModal, $state) {
        this.$scope = $scope;
        this.itemService = itemService;
        this.$ionicListDelegate = $ionicListDelegate;
        this.$ionicModal = $ionicModal;
        this.$state = $state;
        this.summary = itemService.summary();
    }
    ReviewCtrl.prototype.submit = function () {
        this.itemService.save();
        this.$state.go('home');
    };
    ReviewCtrl.$inject = ["$scope", "ItemService", "$ionicListDelegate", "$ionicModal", "$state"];
    return ReviewCtrl;
}());
angular.module('catHacklic.examin', [])
    .controller('ExaminCtrl', ExaminCtrl)
    .controller('ExaminS0Ctrl', ExaminS0Ctrl)
    .controller('ExaminS1Ctrl', ExaminS1Ctrl)
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
                            today: results[1]
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
            ItemService.prototype.saveTodayItems = function (items) {
                this.data.then(function (q) { return q.today = items; });
                if (this._examStep == 0) {
                    this.next();
                }
            };
            ItemService.prototype.next = function () {
                this._examStep++;
                this.$rootScope.$emit('exam.step');
            };
            ItemService.prototype.buildConditions = function (base) {
                var userInfo = this.UserSerivce.user;
                return {
                    mass: base.mass,
                    sunday: (new Date()).getDay() === 0,
                    haveKids: userInfo.haveKids,
                    haveParents: userInfo.haveParents,
                    haveSpouce: userInfo.haveSpouce,
                    hadSex: base.hadSex,
                    hadImmoralThoughs: base.hadImmoralThoughs,
                    voted: base.voted,
                    student: base.student,
                    hadArgument: base.hadArgument
                };
            };
            ItemService.prototype.BasicExam = function () {
                return this.data.then(function (data) { return data.items.filter(function (q) { return q.commandment == -1; }); });
            };
            ItemService.prototype.DetailedExam = function (ids) {
                return [];
            };
            ItemService.prototype.FullExam = function (skipDetailed) {
                skipDetailed = skipDetailed || true;
                return [];
            };
            ItemService.prototype._checkArea = function (area) { this._curItem[area] = this._curItem[area] || []; };
            ItemService.prototype._update = function (area) {
                localStorage['ItemService'] = angular.toJson(this._curItem);
                this.$rootScope.$broadcast('ItemService', area);
            };
            ItemService.prototype.add = function (area, item) {
                this._checkArea(area);
                console.info(this._curItem);
                this._curItem[area].push(item);
                this._update(area);
                return this;
            };
            ItemService.prototype.get = function (area) {
                this._checkArea(area);
                return this._curItem[area];
            };
            ItemService.prototype.edit = function (area, index, item) {
                this._checkArea(area);
                this._curItem[area][index] = item;
                this._update(area);
                return this;
            };
            ItemService.prototype.delete = function (area, index) {
                this._checkArea(area);
                this._curItem[area].splice(index, 1);
                this._update(area);
                return this;
            };
            ItemService.prototype.save = function () {
                var data = JSON.parse(localStorage.getItem('history')) || [];
                data.push(this.summary());
                localStorage['history'] = JSON.stringify(data);
                return this.clear();
            };
            ItemService.prototype.load = function () {
                this._curItem = JSON.parse(localStorage.getItem('ItemService')) || {};
                return this.clear();
            };
            ItemService.prototype.clear = function () {
                var _this = this;
                Object.keys(this._curItem).forEach(function (q) {
                    _this._curItem[q].forEach(function (w) { return w.selected = false; });
                });
                this.$rootScope.$broadcast('ItemService');
                return this;
            };
            ItemService.prototype.summary = function () {
                var summary = {};
                for (var q in this._curItem) {
                    summary[q] = this._curItem[q].filter(function (w) { return w.selected; });
                }
                return summary;
            };
            ItemService.prototype.reset = function () {
                this._curItem["kill"] = starter;
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
