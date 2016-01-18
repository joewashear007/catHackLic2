/// <reference path="./models.ts"/>

module catHacklic {
  export module examin {
    interface ILoadedData {
      items: item[],
      today: todayItem[]
    }


    export class ItemService {
      public static $inject = ["$rootScope", "$q", "$http", "UserSerivce"];

      private _constrants: {};
      private _curItem: { [key: string]: catHacklic.examin.item[] };
      private _loadedData: ng.IPromise<ILoadedData>;

      private _examStep: number;

      constructor(
        private $rootScope: ng.IRootScopeService,
        private $q: ng.IQService,
        private $http: ng.IHttpService,
        private UserSerivce: catHacklic.UserSerivce
        ) {
        this._loadData();
        this._examStep = 0;
      }

      /** Functions loads all of the dat need by the app */
      private _loadData(): ng.IPromise<ILoadedData> {
        if (typeof this._loadedData === "undefined") {
          var defer = this.$q.defer();

          var loadConfigItems = this.$q.when(JSON.parse(localStorage['v1.exam.userConfig'] || '[]'));
          var loadTodayJson = this.$http.get<catHacklic.examin.item[]>('examin/data/todayItems.json').then(q => q.data);
          var loadedTodayItems = this.$q.all([loadConfigItems, loadTodayJson]).then((items: todayItem[][]) => {
            // Merges the config items into the today items
            items[0].forEach(w => items[1].filter(p => p.text == w.text)[0].selected = w.selected);
            // TODO: add in Holy Days!
            items[1].filter(q => q.condition == "sunday")[0].selected = (new Date()).getDay() == 0;
            return items[1];
          });

          var loadCustomItems = this.$q.when(JSON.parse(localStorage['v1.exam.items'] || '[]'));
          var loadJson = this.$http.get<catHacklic.examin.item[]>('examin/data/questions.json').then(q => q.data);

          var loadedItems = this.$q.all([loadJson, loadCustomItems]).then((items: any[][]) => { return items[0].concat(items[1]); });

          this._loadedData = this.$q.all([loadedItems, loadedTodayItems]).then<ILoadedData>((results: any[]) => {
            return {
              items: results[0],
              today: results[1]
            }
          });
        }
        return this._loadedData;
      }

      public get data() { return this._loadedData; }
      public get examStep() { return this._examStep; }

      /** Returns the items need for the about today list */
      public get todayItems(): ng.IPromise<todayItem[]> {
        return this.data.then(q => q.today.filter(w => w.show));
      }

      /**
       * Return all of the items for the awarness section, filter by the about today selection
       * @param [shown] returns the shown or not show list set
       */
      public examItems(shown?: boolean): ng.IPromise<item[]> {
        if (typeof shown === "undefined") { shown = true; }
        return this._filterExamItems().then(q => q.items.filter(w => w.shown == shown));
      }

      public saveExamItems(items: item[]): void {
        // TODO: Somehting here?
      }

      public saveTodayItems(items: todayItem[]): void {
        // this.data.then(q => q.today = items);
        if (this._examStep == 0) { this.next(); }
      }

      /** Notifies the application that the next step of the examin is allowed */
      public next(): void {
        this._examStep++;
        this.$rootScope.$emit('exam.step');
      }

      private _filterExamItems(): ng.IPromise<ILoadedData> {
        return this.data.then(q => {
          q.items.forEach(w => {
            var conditionMet = false;
            w.condition = w.condition || "";
            if (w.condition != "") {
              var conditions = w.condition.split(',');
              conditionMet = q.today.some(p => p.selected && conditions.indexOf(p.condition) > -1);
            }
            w.shown = w.common > 0 || conditionMet;
          });
          return q;
        });
      }




      /**
       * Returns the full exam
       * @param skipDetailed Skips the exam items that were given by the detailed exam
       */
      public FullExam(skipDetailed: boolean): item[] {
        skipDetailed = skipDetailed || true;
        return [];
      }

      private _checkArea(area: string) { this._curItem[area] = this._curItem[area] || []; }

      private _update(area: string) {
        localStorage['ItemService'] = angular.toJson(this._curItem);
        this.$rootScope.$broadcast('ItemService', area);
      }

      public add(area: string, item: item): ItemService {
        this._checkArea(area);
        console.info(this._curItem);
        this._curItem[area].push(item);
        this._update(area);
        return this;
      }

      public get(area: string): item[] {
        this._checkArea(area);
        return this._curItem[area];
      }


      public edit(area: string, index: number, item: item): ItemService {
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

      public summary(): summary {
        var summary: summary = {};
        for (var q in this._curItem) {
          summary[q] = this._curItem[q].filter(w => w.selected);
        }
        return summary;
      }

      public reset() {
        this._curItem["kill"] = starter;
      }
    }
  }
}

angular.module('catHacklic.examin')
  .service('ItemService', catHacklic.examin.ItemService);
