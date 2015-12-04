angular.module('app.services', [])

.factory('BlankFactory', [function() {

}])

.service('ItemService', ['$rootScope', function($rootScope) {
  var _curItem = null;
  var _checkArea = function(area) {
    if (!(area in _curItem)) {
      _curItem[area] = [];
    }
  }
  var ItemService = {
    add: function(area, item) {
      ItemService.load();
      _checkArea(area);
      _curItem[area].push(item);
      $rootScope.$broadcast('ItemService', area);
      return this;
    },
    get: function(area) {
      ItemService.load();
      _checkArea(area);
      return _curItem[area];
    },
    edit: function(area, index, item) {
      ItemService.load();
      _checkArea(area);
      _curItem[area][index] = item;
      $rootScope.$broadcast('ItemService', area);
      return this;
    },
    delete: function(area, index) {
      ItemService.load();
      _checkArea(area);
      _curItem[area].splice(index, 1);
      $rootScope.$broadcast('ItemService', area);
      return this;
    },
    save: function() {
      localStorage['ItemService'] = JSON.stringify(_curItem);
      return this;
    },
    load: function() {
      if (_curItem === null) {
        _curItem = JSON.parse(localStorage.getItem('ItemService')) || {};
        $rootScope.$broadcast('ItemService');
      }
      return this;
    },
    clear: function() {
      Object.keys(_curItem).forEach(q => {
        _curItem[q].forEach(w => w.selected = false);
      });
      $rootScope.$broadcast('ItemService');
      return this;
    },
    summary: function(areas) {
      ItemService.load();
      var summary = {};
      areas.forEach( function(q) {
        if(q in _curItem)
          summary[q] = _curItem[q].filter(w => w.selected);
      });
      return summary;
    }
  };
  return ItemService;
}]);
