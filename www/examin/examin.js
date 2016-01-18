var ExaminCtrl = (function () {
    function ExaminCtrl($scope, itemService, $ionicListDelegate, $ionicModal, $state) {
        var _this = this;
        this.$scope = $scope;
        this.itemService = itemService;
        this.$ionicListDelegate = $ionicListDelegate;
        this.$ionicModal = $ionicModal;
        this.$state = $state;
        $ionicModal.fromTemplateUrl('modal.html', { scope: $scope }).then(function (m) { _this.modal = m; });
        this.area = "blessing";
        this.editItem = { text: "", common: 0, id: 1000 };
        this.editId = -1;
        itemService.BasicExam().then(function (d) { return _this.baseExam = d; });
    }
    ExaminCtrl.prototype.select = function (area) {
        console.log("Selected: ", area);
        if (area == "summary") {
            this.summary = this.itemService.summary();
            console.info(this.summary);
        }
        else {
            this.area = area;
            this.items = this.itemService.get(this.area);
        }
    };
    ExaminCtrl.prototype.close = function () { this.modal.hide(); };
    ExaminCtrl.prototype.add = function () {
        this.editId = -1;
        this.modal.show();
    };
    ExaminCtrl.prototype.save = function () {
        console.log(this.editItem, this.area);
        if (this.editId < 0) {
            this.editItem.selected = true;
            this.itemService.add(this.area, this.editItem);
        }
        else {
            this.itemService.edit(this.area, this.editId, this.editItem);
        }
        this.editItem = { text: "", id: 1001, common: 0 };
        this.modal.hide();
    };
    ExaminCtrl.prototype.edit = function (id) {
        this.editId = id;
        this.editItem = this.items[id];
        this.modal.show();
        this.$ionicListDelegate.closeOptionButtons();
    };
    ExaminCtrl.prototype.delete = function (id) { this.itemService.delete(this.area, id); };
    ;
    ExaminCtrl.prototype.update = function (id) {
        this.items[id].selected = !this.items[id].selected;
        this.itemService.edit(this.area, id, this.items[id]);
    };
    ExaminCtrl.prototype.clear = function () { this.itemService.clear(); };
    ;
    ExaminCtrl.prototype.reset = function () { this.itemService.reset(); this.items = this.itemService.get(this.area); };
    ExaminCtrl.$inject = ["$scope", "ItemService", "$ionicListDelegate", "$ionicModal", "$state"];
    return ExaminCtrl;
}());
var ExaminS0Ctrl = (function () {
    function ExaminS0Ctrl($scope, $ionicModal, itemService) {
        var _this = this;
        this.$scope = $scope;
        this.$ionicModal = $ionicModal;
        this.itemService = itemService;
        itemService.todayItems.then(function (q) { return _this.items = q; });
        $ionicModal.fromTemplateUrl('examin-s0-help.html', { scope: $scope }).then(function (m) { return _this.helpModal = m; });
    }
    ExaminS0Ctrl.prototype.done = function () {
        console.log(this.items.filter(function (q) { return q.selected; }));
        this.itemService.saveTodayItems(this.items);
    };
    ExaminS0Ctrl.prototype.help = function () { this.helpModal.show(); };
    ExaminS0Ctrl.prototype.helpClose = function () { this.helpModal.hide(); };
    ExaminS0Ctrl.$inject = ['$scope', '$ionicModal', 'ItemService'];
    return ExaminS0Ctrl;
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
            Object.defineProperty(ItemService.prototype, "todayItems", {
                get: function () {
                    return this.data.then(function (q) { return q.today.filter(function (w) { return w.show; }); });
                },
                enumerable: true,
                configurable: true
            });
            ItemService.prototype.saveTodayItems = function (items) {
                this.data.then(function (q) { return q.today = items; });
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
