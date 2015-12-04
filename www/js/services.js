angular.module('app.services', [])

.service('ItemService', ['$rootScope', function($rootScope) {
  var _curItem;
  var _checkArea = function(area) {
    if (typeof _curItem === "undefined") {
      ItemService.load();
    }
    if (area && !(area in _curItem)) {
      _curItem[area] = [];
    }
  };
  var _update = function(area) {
    localStorage['ItemService'] = JSON.stringify(_curItem);
    $rootScope.$broadcast('ItemService', area);
  };
  var ItemService = {
    add: function(area, item) {
      _checkArea(area);
      _curItem[area].push(item);
      _update(area);
      return this;
    },
    get: function(area) {
      _checkArea(area);
      return _curItem[area];
    },
    edit: function(area, index, item) {
      _checkArea(area);
      _curItem[area][index] = item;
      _update(area);
      return this;
    },
    delete: function(area, index) {
      _checkArea(area);
      _curItem[area].splice(index, 1);
      _update(area);
      return this;
    },
    save: function() {
      var data = JSON.parse(localStorage.getItem('history')) || [];
      data.push(ItemService.summary());
      localStorage['history'] = JSON.stringify(data);
      return ItemService.clear();
    },
    load: function() {
      _curItem = JSON.parse(localStorage.getItem('ItemService')) || {};
      return ItemService.clear();
    },
    clear: function() {
      Object.keys(_curItem).forEach(q => {
        _curItem[q].forEach(w => w.selected = false);
      });
      $rootScope.$broadcast('ItemService');
      return this;
    },
    summary: function(areas) {
      _checkArea();
      var summary = {};
      (areas || Object.keys(_curItem)).forEach(function(q) {
        if (q in _curItem)
          summary[q] = _curItem[q].filter(w => w.selected);
      });
      return summary;
    }
  };
  return ItemService;
}]);
