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
        "";
        this.editItem = {};
        this.editId = -1;
        this.items = itemService.get(this.area);
    }
    ExaminCtrl.prototype.select = function (area) {
        console.log("Selected: ", area);
        if (area == "summary") {
            this.summary = this.itemService.summary(['blessing', 'ask', 'kill', 'embrace', 'resolution']);
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
        this.editItem = {};
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
    ExaminCtrl.$inject = ["$scope", "ItemService", "$ionicListDelegate", "$ionicModal", "$state"];
    return ExaminCtrl;
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
    ReviewCtrl.prototype.clear = function () { this.itemService.clear(); this.summary = this.itemService.summary(); };
    ;
    ReviewCtrl.prototype.submit = function () {
        this.itemService.save();
        this.$state.go('home');
    };
    ReviewCtrl.$inject = ["$scope", "ItemService", "$ionicListDelegate", "$ionicModal", "$state"];
    return ReviewCtrl;
}());
angular.module('catHacklic.examin', [])
    .controller('ExaminCtrl', ExaminCtrl)
    .controller('ReviewCtrl', ReviewCtrl);

var catHacklic;
(function (catHacklic) {
    var examin;
    (function (examin) {
        var ItemService = (function () {
            function ItemService($rootScope) {
                this.$rootScope = $rootScope;
                this._curItem = JSON.parse(localStorage.getItem('ItemService')) || {};
                this.clear();
            }
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
            ItemService.prototype.summary = function (areas) {
                var _this = this;
                var summary = {};
                (areas || Object.keys(this._curItem)).forEach(function (q) {
                    if (q in _this._curItem)
                        summary[q] = _this._curItem[q].filter(function (w) { return w.selected; });
                });
                return summary;
            };
            ItemService.$inject = ["$rootScope"];
            return ItemService;
        }());
        examin.ItemService = ItemService;
    })(examin = catHacklic.examin || (catHacklic.examin = {}));
})(catHacklic || (catHacklic = {}));
angular.module('catHacklic.examin')
    .service('ItemService', catHacklic.examin.ItemService);
