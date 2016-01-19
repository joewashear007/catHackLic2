/// <reference path="./models.ts"/>

module catHacklic {
  export module examin {
    interface ILoadedData {
      items: item[],
      today: todayItem[]
      notes: string[]
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
              today: results[1],
              notes: []
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

      public saveExamItems(items: Iitem[]): void {
        // TODO: Somehting here?
      }

      public saveTodayItems(items: todayItem[]): void {
        // this.data.then(q => q.today = items);
        if (this._examStep == 0) { this.next(); }
      }

      public saveNote(id: number, note: string): ng.IPromise<string[]> {
        return this.data.then(d => { d.notes[id] = note; return d.notes; });
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


      public save(): ng.IPromise<any> {
        console.warn("NOT IMPLEMENTED");
        return this.data;
      }


      public clear(): ng.IPromise<ILoadedData> {
        return this.data.then(q => {
          q.items.forEach(w => w.selected = false);
          q.today.forEach(w => w.selected = false);
          return q;
        });
      }

      public summary(): ng.IPromise<examin.summary> {
        return this.data.then(d => {
          console.log("Summary!", d.notes);
          var summary: examin.summary = [];

          var todayItemsSummary: { text: string }[] = [];
          d.today.forEach(q => { if (q.selected) { todayItemsSummary.push({ text: q.text, }) } });
          var awarnessItems: { text: string }[] = []
          d.items.forEach(q => { if (q.selected) { todayItemsSummary.push({ text: q.text, }) } });

          summary.push({ note: d.notes[0], items: todayItemsSummary });
          summary.push({ note: d.notes[1], items: [] });
          summary.push({ note: d.notes[2], items: awarnessItems });
          summary.push({ note: d.notes[3], items: [] });
          summary.push({ note: d.notes[4], items: [] });
          summary.push({ note: d.notes[5], items: [] });
          summary.push({ note: d.notes[6], items: [] });
          summary.push({ note: d.notes[7], items: [] });

          return summary;
        });
      }
    }
  }
}

angular.module('catHacklic.examin')
  .service('ItemService', catHacklic.examin.ItemService);
