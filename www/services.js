"use strict";
var ItemService = (function () {
    function ItemService($rootScope) {
        this.$rootScope = $rootScope;
    }
    ItemService.prototype._checkArea = function (area) {
        if (typeof this._curItem === "undefined") {
            this.load();
        }
        if (area && !(area in this._curItem)) {
            this._curItem[area] = [];
        }
    };
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
        this._checkArea();
        var summary = {};
        (areas || Object.keys(this._curItem)).forEach(function (q) {
            if (q in _this._curItem)
                summary[q] = _this._curItem[q].filter(function (w) { return w.selected; });
        });
        return summary;
    };
    return ItemService;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ItemService;
angular.module('app.services', [])
    .service('ItemService', ItemService);
