/// <reference path="./models.ts"/>

module catHacklic {
  export module examin {
    export class ItemService {
      public static $inject = ["$rootScope"];

      private _curItem: ExaminItem;

      constructor(private $rootScope: ng.IRootScopeService) {
        this._curItem = JSON.parse(localStorage.getItem('ItemService')) || {};
        this.clear();
      }

      private _checkArea(area: string) { this._curItem[area] = this._curItem[area] || []; }

      private _update(area: string) {
        localStorage['ItemService'] = angular.toJson(this._curItem);
        this.$rootScope.$broadcast('ItemService', area);
      }

      public add(area: string, item: ExaminItem): ItemService {
        this._checkArea(area);
        console.info(this._curItem);
        this._curItem[area].push(item);
        this._update(area);
        return this;
      }

      public get(area: string): ExaminItem[] {
        this._checkArea(area);
        return this._curItem[area];
      }

      public edit(area: string, index: number, item: ExaminItem): ItemService {
        this._checkArea(area);
        this._curItem[area][index] = item;
        this._update(area);
        return this;
      }

      public delete(area: string, index: number): ItemService {
        this._checkArea(area);
        this._curItem[area].splice(index, 1);
        this._update(area);
        return this;
      }

      public save(): ItemService {
        var data = JSON.parse(localStorage.getItem('history')) || [];
        data.push(this.summary());
        localStorage['history'] = JSON.stringify(data);
        return this.clear();
      }

      public load(): ItemService {
        this._curItem = JSON.parse(localStorage.getItem('ItemService')) || {};
        return this.clear();
      }

      public clear(): ItemService {
        Object.keys(this._curItem).forEach(q => {
          this._curItem[q].forEach(w => w.selected = false);
        });
        this.$rootScope.$broadcast('ItemService');
        return this;
      }

      public summary(areas?: string[]): any {
        var summary = {};
        (areas || Object.keys(this._curItem)).forEach(q => {
          if (q in this._curItem)
            summary[q] = this._curItem[q].filter(w => w.selected);
        });
        return summary;
      }
    }
  }
}

angular.module('catHacklic.examin')
  .service('ItemService', catHacklic.examin.ItemService);
