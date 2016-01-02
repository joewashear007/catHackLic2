var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseExaminCtrl = (function () {
    function BaseExaminCtrl(itemService, $ionicListDelegate, $ionicModal) {
        var _this = this;
        this.itemService = itemService;
        this.$ionicListDelegate = $ionicListDelegate;
        this.$ionicModal = $ionicModal;
        $ionicModal.fromTemplateUrl(this.area + '.html', { scope: this }).then(function (m) { _this.modal = m; });
        this.editItem = {};
        this.editId = -1;
    }
    BaseExaminCtrl.prototype.close = function () { this.modal.hide(); };
    BaseExaminCtrl.prototype.add = function () {
        this.editId = -1;
        this.modal.show();
    };
    BaseExaminCtrl.prototype.save = function () {
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
    BaseExaminCtrl.prototype.edit = function (id) {
        this.editId = id;
        this.editItem = this.items[id];
        this.modal.show();
        this.$ionicListDelegate.closeOptionButtons();
    };
    BaseExaminCtrl.prototype.delete = function (id) { this.itemService.delete(this.area, id); };
    ;
    BaseExaminCtrl.prototype.update = function (id) {
        this.items[id].selected = !this.items[id].selected;
        this.itemService.edit(this.area, id, this.items[id]);
    };
    return BaseExaminCtrl;
}());
var BlessingCtrl = (function (_super) {
    __extends(BlessingCtrl, _super);
    function BlessingCtrl(itemService, $ionicListDelegate, $ionicModal) {
        this.area = "blessing";
        _super.call(this, itemService, $ionicListDelegate, $ionicModal);
    }
    return BlessingCtrl;
}(BaseExaminCtrl));
var AskCtrl = (function (_super) {
    __extends(AskCtrl, _super);
    function AskCtrl(itemService, $ionicListDelegate, $ionicModal) {
        this.area = "ask";
        _super.call(this, itemService, $ionicListDelegate, $ionicModal);
    }
    return AskCtrl;
}(BaseExaminCtrl));
var KillCtrl = (function (_super) {
    __extends(KillCtrl, _super);
    function KillCtrl(itemService, $ionicListDelegate, $ionicModal) {
        this.area = "kill";
        _super.call(this, itemService, $ionicListDelegate, $ionicModal);
    }
    return KillCtrl;
}(BaseExaminCtrl));
var EmbraceCtrl = (function (_super) {
    __extends(EmbraceCtrl, _super);
    function EmbraceCtrl(itemService, $ionicListDelegate, $ionicModal) {
        this.area = "embrace";
        _super.call(this, itemService, $ionicListDelegate, $ionicModal);
    }
    return EmbraceCtrl;
}(BaseExaminCtrl));
var ResolutionCtrl = (function (_super) {
    __extends(ResolutionCtrl, _super);
    function ResolutionCtrl(itemService, $ionicListDelegate, $ionicModal) {
        this.area = "resolution";
        _super.call(this, itemService, $ionicListDelegate, $ionicModal);
    }
    return ResolutionCtrl;
}(BaseExaminCtrl));
var ReviewCtrl = (function () {
    function ReviewCtrl($scope, ItemService, $state) {
        var _this = this;
        this.$scope = $scope;
        this.ItemService = ItemService;
        this.$state = $state;
        this.summary = ItemService.summary(['blessing', 'ask', 'kill', 'embrace', 'resolution']);
        $scope.$on("ItemService", function () {
            _this.summary = ItemService.summary(['blessing', 'ask', 'kill', 'embrace', 'resolution']);
        });
    }
    ReviewCtrl.prototype.save = function () {
        this.ItemService.save();
        this.$state.go('home');
    };
    ;
    ReviewCtrl.prototype.clear = function () { this.ItemService.clear(); };
    ;
    return ReviewCtrl;
}());
angular.module('catHacklic.examin', [])
    .controller('BlessingCtrl', BlessingCtrl)
    .controller('AskCtrl', AskCtrl)
    .controller('KillCtrl', KillCtrl)
    .controller('EmbraceCtrl', EmbraceCtrl)
    .controller('KillCtrl', KillCtrl)
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
                localStorage['ItemService'] = JSON.stringify(this._curItem);
                this.$rootScope.$broadcast('ItemService', area);
            };
            ItemService.prototype.add = function (area, item) {
                this._checkArea(area);
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
