export default class ItemService {
  constructor(private $rootScope: ng.IRootScopeService) {

  }
  private _curItem: catHacklic.ExaminItem;
  private _checkArea(area?: string) {
    if (typeof this._curItem === "undefined") {
      this.load();
    }
    if (area && !(area in this._curItem)) {
      this._curItem[area] = [];
    }
  }
  private _update(area: string) {
    localStorage['ItemService'] = JSON.stringify(this._curItem);
    this.$rootScope.$broadcast('ItemService', area);
  }
  public add(area: string, item: catHacklic.ExaminItem): ItemService {
    this._checkArea(area);
    this._curItem[area].push(item);
    this._update(area);
    return this;
  }
  public get(area: string): catHacklic.ExaminItem {
    this._checkArea(area);
    return this._curItem[area];
  }
  public edit(area: string, index: number, item: catHacklic.ExaminItem): ItemService {
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
    this._checkArea();
    var summary = {};
    (areas || Object.keys(this._curItem)).forEach(q => {
      if (q in this._curItem)
        summary[q] = this._curItem[q].filter(w => w.selected);
    });
    return summary;
  }
}

angular.module('app.services', [])
.service('ItemService', ItemService);
