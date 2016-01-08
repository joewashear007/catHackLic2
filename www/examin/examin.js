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
        this.editItem = { text: "" };
        this.editId = -1;
        this.items = itemService.get(this.area);
    }
    ExaminCtrl.prototype.select = function (area) {
        console.log("Selected: ", area);
        if (area == "summary") {
            this.summary = this.itemService.summary();
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
        this.editItem = { text: "" };
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
    ExaminCtrl.prototype.reset = function () { this.itemService.reset(); this.items = this.itemService.get(this.area); };
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
            ItemService.prototype.summary = function () {
                var summary = {};
                for (var q in this._curItem) {
                    summary[q] = this._curItem[q].filter(function (w) { return w.selected; });
                }
                return summary;
            };
            ItemService.prototype.reset = function () {
                this._curItem["kill"] = starter;
            };
            ItemService.$inject = ["$rootScope"];
            return ItemService;
        }());
        examin.ItemService = ItemService;
    })(examin = catHacklic.examin || (catHacklic.examin = {}));
})(catHacklic || (catHacklic = {}));
angular.module('catHacklic.examin')
    .service('ItemService', catHacklic.examin.ItemService);

var starter = [
    { text: "Intentionally omitted sins during confession?", commandment: 1, },
    { text: "Hidden a sin in confession", commandment: 1, },
    { text: "Dispaired God's forgiveness of my sins", commandment: 1, },
    { text: "Committed a sin expecting God's forgiven (Presumption)", commandment: 1, },
    { text: "Neglacted my daily prayers", commandment: 1, },
    { text: "Replaced God as higthest priority in life (with fame, fortune, money, career, pleasure, power, sex, ambition)", commandment: 1, },
    { text: "Proposely neglacted learning about my faith", commandment: 1, },
    { text: "Blamed God for the troubles in my life", commandment: 1, },
    { text: "Denied any of the Catholic Church’s dogmas?", commandment: 1, },
    { text: "Received Holy Communion in the state of mortal sin? (Desecration)", commandment: 1, },
    { text: "Indifference/lukewarm to the God or the Faith", commandment: 1, },
    { text: "Abandoned promises or vows made to God?", commandment: 1, },
    { text: "Knowingly read any anti-Catholic literature?", commandment: 1, },
    { text: "Made fun of God, Our Lady, the Saints, the Church, the Sacraments, other holy things?", commandment: 1, },
    { text: "Mocked someone for their faith in God?", commandment: 1, },
    { text: "Forced others to violate the tenets of their faith or conscience?", commandment: 1, },
    { text: "Deliberately misled others about doctrine or the faith?", commandment: 1, },
    { text: "Seriously wishing evil upon another?", commandment: 2, },
    { text: "Used God's name in vain by way of profanity?", commandment: 2, },
    { text: "Murmured or complained against God (blasphemy)?", commandment: 2, },
    { text: "Watched television or movies, or listened to music that treated God, the Church, the saints, or sacred things irreverently?", commandment: 2, },
    { text: "Belittled others in my speech?", commandment: 2, },
    { text: "Behaved disrespectfully in Church?", commandment: 2, },
    { text: "Misused places or things set apart for the worship of God?", commandment: 2, },
    { text: "Used vulgar, suggestive or obscene speech?", commandment: 2, },
    { text: "Blamed God for my failings?", commandment: 2, },
    { text: "Angered others so as to make them swear or blaspheme God?", commandment: 2, },
    { text: "Used foul language?", commandment: 2, },
    { text: "Watched movies or music that contained foul language?", commandment: 2, },
    { text: "Shown disrespect by leaving Mass early, not paying attention or not joining in the prayers?", commandment: 3, },
    { text: "Did I do unnecessary work on Sunday which could have been done the day before?", commandment: 3, },
    { text: "Have I been stingy in my support for the Church?", commandment: 3, },
    { text: "Missed Mass on Sunday or a Holy Day of Obligation without a serious reason", commandment: 3, },
    { text: "Intentional failure to fast or abstain on appointed days", commandment: 3, },
    { text: "Have I been late for Mass through my own negligence?", commandment: 3, },
    { text: "Have I refused to help others attend Mass on Sundays and Holy Days?", commandment: 3, },
    { text: "Have I shopped or benefitted from unnecessary service on Sundays and Holy Days?", commandment: 3, },
    { text: "Have I devoted time to my family and loved ones on Sundays and Holy Days?", commandment: 3, },
    { text: "Set time aside each day for personal prayer to God?", commandment: 3, },
    { text: "Do I show little or no interest in my children’s faith and practice of it?", commandment: 5, },
    { text: "Have I showed disrespect for those in authority, government or church?", commandment: 5, },
    { text: "Have I been disobedient and/or disrespectful to my parents or guardians?", commandment: 5, },
    { text: "Did I neglect to help with household chores?", commandment: 5, },
    { text: "Have I caused unnecessary worry and anxiety by my attitude, behavior, moods, etc.?", commandment: 5, },
    { text: "Serious failure to care for aged parents?", commandment: 5, },
    { text: "Serious neglect of the duties of one’s state in life", commandment: 5, },
    { text: "Serious neglect of the religious education or upbringing of children", commandment: 5, },
    { text: "Have I mistreated my wife or children?", commandment: 5, },
    { text: "Have I allowed them to neglect their religious duties?", commandment: 5, },
    { text: "Have I otherwise failed to discipline them?", commandment: 5, },
    { text: "Obeyed the reasonable demands of my teachers, if in school?", commandment: 5, },
    { text: "Have I voted for, promoted or advanced the agenda of politicians who hold positions contrary to the common good, religious freedom, or the moral law?", commandment: 5, },
    { text: "Have I failed to provide a good example of a virtuous life to others in my care?", commandment: 5, },
    { text: "Have I failed to love and sacrifice for my family?", commandment: 5, },
    { text: "Have I encouraged others to disrespect legitimate authority?", commandment: 5, },
    { text: "Have I failed to accept my parents’ advice or admonishments?", commandment: 5, },
    { text: "Have I failed to perform my civic duties such as voting, paying taxes, and service requirements such as jury duty, or just obligatory military service?", commandment: 5, },
    { text: "Have I failed to promote the just treatment of the poor, indigent, or migrants in society?", commandment: 5, },
    { text: "Have I failed in due reverence to aged persons?", commandment: 5, },
    { text: "Have I mistreated my spouse or my children?", commandment: 5, },
    { text: "Have I scandalized them by cursing or swearing in front of them?", commandment: 5, },
    { text: "Did I consent, recommend, advise, approve, support or have an abortion?", commandment: 5, },
    { text: "Have I committed an act of violence or abuse (physical, sexual, emotional or verbal)?", commandment: 5, },
    { text: "Have I endangered the lives of others by reckless driving or by driving under the influence of drugs or alcohol?", commandment: 5, },
    { text: "Do I show contempt for my body by neglecting to take care of my own health?", commandment: 5, },
    { text: "Have I been mean or unjust to anyone?", commandment: 5, },
    { text: "Have I held a grudge or sought revenge against someone who wronged me?", commandment: 5, },
    { text: "Do I point out others’ faults and mistakes while ignoring my own?", commandment: 5, },
    { text: "Do I complain more than I compliment?", commandment: 5, },
    { text: "Am I ungrateful for what other people do for me?", commandment: 5, },
    { text: "Do I tear people down rather than encourage them?", commandment: 5, },
    { text: "Am I prejudiced against people because of their color, language or ethnic-religious background?", commandment: 5, },
    { text: "Knowingly voting for someone who is pro-abortion?", commandment: 5, },
    { text: "Willfully leading another into serious sin?", commandment: 5, },
    { text: "Willfully injuring or trying to hurt another person?", commandment: 5, },
    { text: "Driving dangerously or recklessly?", commandment: 5, },
    { text: "Willful drunkenness?", commandment: 5, },
    { text: "Excessive tattoos?", commandment: 5, },
    { text: "Excessive body piercing?", commandment: 5, },
    { text: "Serious entertainment of suicidal thoughts?", commandment: 5, },
    { text: "Intentionally placing temptation before the weak?", commandment: 5, },
    { text: "Have I quarreled with any one?", commandment: 5, },
    { text: "Have I cursed anyone or otherwise wished evil on him?", commandment: 5, },
    { text: "Is there anyone to whom I refuse to speak or be reconciled?", commandment: 5, },
    { text: "Have I lied about anyone (calumny)?", commandment: 5, },
    { text: "Have I taken pleasure in anyone's misfortune?", commandment: 5, },
    { text: "Have I rash judged anyone of a serious sin?", commandment: 5, },
    { text: "Have I engaged in gossip (detraction) or spread scandal?", commandment: 5, },
    { text: "Have I lent an ear to scandal about my neighbor?", commandment: 5, },
    { text: "Have I been jealous or envious of anyone?", commandment: 5, },
    { text: "Verbally or emotionally abused another person?", commandment: 5, },
    { text: "Unjustly threatened another person with bodily harm?", commandment: 5, },
    { text: "Purposely provoked another by teasing or nagging?", commandment: 5, },
    { text: "Over-eaten?", commandment: 5, },
    { text: "Helped another to commit a mortal sin (through advice, driving them somewhere, etc.)?", commandment: 5, },
    { text: "Indulged in serious anger?", commandment: 5, },
    { text: "Been unforgiving to others, when mercy or pardon was requested?", commandment: 5, },
    { text: "Sought revenge or hoped something bad would happen to someone?", commandment: 5, },
    { text: "Have I failed to “turn the other cheek” or love my enemies?", commandment: 5, },
    { text: "Have I failed to provide proper burial for the dead?", commandment: 5, },
    { text: "Have I failed to show respect for the dead or their bodies?", commandment: 5, },
    { text: "Have I advocated unjust punishments or capital punishment where it is not just?", commandment: 5, },
    { text: "Have I mocked, intimidated or belittled someone?", commandment: 5, },
    { text: "Have I failed to correct in Charity?", commandment: 5, },
    { text: "Have I harmed anyone’s soul, especially children, by giving scandal through bad example?", commandment: 5, },
    { text: "Have I failed to show respect for the dead or their bodies?", commandment: 5, },
    { text: "Have I harmed my own soul by intentionally and without necessity exposing it to temptations, e.g.: bad TV, bad music, beaches, etc.", commandment: 5, },
    { text: "Have I failed to show respect for the dead or their bodies?", commandment: 5, },
    { text: "Have I failed to show respect for the dead or their bodies?", commandment: 5, },
];
