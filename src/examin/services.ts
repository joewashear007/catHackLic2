/// <reference path="./models.ts"/>

module catHacklic {
  export module examin {
    export class ItemService {
      public static $inject = ["$rootScope", "$http", "UserSerivce"];

      private _constrants: { };
      private _customItems: catHacklic.examin.item[];
      private _curItem: { [key: string]: catHacklic.examin.item[] };
      private _baseQuestions: catHacklic.examin.item[];

      constructor(
        private $rootScope: ng.IRootScopeService,
        private $http: ng.IHttpService,
        private UserSerivce: catHacklic.UserSerivce
      ) {
        this._curItem = JSON.parse(localStorage.getItem('ItemService')) || {};
        this.clear();
        this._customItems = JSON.parse(localStorage['v1.exam.items'] || {});
        $http.get<catHacklic.examin.item[]>('examin/data/questions.json').then(d => {
          this._baseQuestions = d.data;
        });
      }

      public buildConditions(base: basicExam): conditions {
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
      }

      /** Return the basic exam questions */
      public BasicExam(): item[] {
        return [];
      }

      /** Returns the detailed exam computed by on the BasicExam */
      public DetailedExam(): item[] {
        return [];
      }

      /**
       * Returns the full exam
       * @param skipDetailed Skips the exam items that were given by the detailed exam
       */
      public FullExam(skipDetailed:boolean) :item [] {
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
