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
            function ItemService($rootScope, $http, UserSerivce) {
                var _this = this;
                this.$rootScope = $rootScope;
                this.$http = $http;
                this.UserSerivce = UserSerivce;
                this._curItem = JSON.parse(localStorage.getItem('ItemService')) || {};
                this.clear();
                this._customItems = JSON.parse(localStorage['v1.exam.items'] || {});
                $http.get('examin/data/questions.json').then(function (d) {
                    _this._baseQuestions = d.data;
                });
            }
            ItemService.prototype.buildConditions = function (base) {
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
            };
            ItemService.prototype.BasicExam = function () {
                return [];
            };
            ItemService.prototype.DetailedExam = function () {
                return [];
            };
            ItemService.prototype.FullExam = function (skipDetailed) {
                skipDetailed = skipDetailed || true;
                return [];
            };
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
            ItemService.$inject = ["$rootScope", "$http", "UserSerivce"];
            return ItemService;
        }());
        examin.ItemService = ItemService;
    })(examin = catHacklic.examin || (catHacklic.examin = {}));
})(catHacklic || (catHacklic = {}));
angular.module('catHacklic.examin')
    .service('ItemService', catHacklic.examin.ItemService);

var starter = [
    { id: 0, text: "Intentionally omitted sins during confession?", commandment: 1, },
    { id: 0, text: "Hidden a sin in confession", commandment: 1, },
    { id: 0, text: "Dispaired God's forgiveness of my sins", commandment: 1, },
    { id: 0, text: "Committed a sin expecting God's forgiven (Presumption)", commandment: 1, },
    { id: 0, text: "Neglacted my daily prayers", commandment: 1, },
    { id: 0, text: "Replaced God as higthest priority in life (with fame, fortune, money, career, pleasure, power, sex, ambition)", commandment: 1, },
    { id: 0, text: "Proposely neglacted learning about my faith", commandment: 1, },
    { id: 0, text: "Blamed God for the troubles in my life", commandment: 1, },
    { id: 0, text: "Denied any of the Catholic Church’s dogmas?", commandment: 1, },
    { id: 0, text: "Received Holy Communion in the state of mortal sin? (Desecration)", commandment: 1, },
    { id: 0, text: "Indifference/lukewarm to the God or the Faith", commandment: 1, },
    { id: 0, text: "Abandoned promises or vows made to God?", commandment: 1, },
    { id: 0, text: "Knowingly read any anti-Catholic literature?", commandment: 1, },
    { id: 0, text: "Made fun of God, Our Lady, the Saints, the Church, the Sacraments, other holy things?", commandment: 1, },
    { id: 0, text: "Mocked someone for their faith in God?", commandment: 1, },
    { id: 0, text: "Forced others to violate the tenets of their faith or conscience?", commandment: 1, },
    { id: 0, text: "Deliberately misled others about doctrine or the faith?", commandment: 1, },
    { id: 0, text: "Seriously wishing evil upon another?", commandment: 2, },
    { id: 0, text: "Used God's name in vain by way of profanity?", commandment: 2, },
    { id: 0, text: "Murmured or complained against God (blasphemy)?", commandment: 2, },
    { id: 0, text: "Watched television or movies, or listened to music that treated God, the Church, the saints, or sacred things irreverently?", commandment: 2, },
    { id: 0, text: "Belittled others in my speech?", commandment: 2, },
    { id: 0, text: "Behaved disrespectfully in Church?", commandment: 2, },
    { id: 0, text: "Misused places or things set apart for the worship of God?", commandment: 2, },
    { id: 0, text: "Used vulgar, suggestive or obscene speech?", commandment: 2, },
    { id: 0, text: "Blamed God for my failings?", commandment: 2, },
    { id: 0, text: "Angered others so as to make them swear or blaspheme God?", commandment: 2, },
    { id: 0, text: "Used foul language?", commandment: 2, },
    { id: 0, text: "Watched movies or music that contained foul language?", commandment: 2, },
    { id: 0, text: "Shown disrespect by leaving Mass early, not paying attention or not joining in the prayers?", commandment: 3, },
    { id: 0, text: "Did I do unnecessary work on Sunday which could have been done the day before?", commandment: 3, },
    { id: 0, text: "Have I been stingy in my support for the Church?", commandment: 3, },
    { id: 0, text: "Missed Mass on Sunday or a Holy Day of Obligation without a serious reason", commandment: 3, },
    { id: 0, text: "Intentional failure to fast or abstain on appointed days", commandment: 3, },
    { id: 0, text: "Have I been late for Mass through my own negligence?", commandment: 3, },
    { id: 0, text: "Have I refused to help others attend Mass on Sundays and Holy Days?", commandment: 3, },
    { id: 0, text: "Have I shopped or benefitted from unnecessary service on Sundays and Holy Days?", commandment: 3, },
    { id: 0, text: "Have I devoted time to my family and loved ones on Sundays and Holy Days?", commandment: 3, },
    { id: 0, text: "Set time aside each day for personal prayer to God?", commandment: 3, },
    { id: 0, text: "Do I show little or no interest in my children’s faith and practice of it?", commandment: 5, },
    { id: 0, text: "Have I showed disrespect for those in authority, government or church?", commandment: 5, },
    { id: 0, text: "Have I been disobedient and/or disrespectful to my parents or guardians?", commandment: 5, },
    { id: 0, text: "Did I neglect to help with household chores?", commandment: 5, },
    { id: 0, text: "Have I caused unnecessary worry and anxiety by my attitude, behavior, moods, etc.?", commandment: 5, },
    { id: 0, text: "Serious failure to care for aged parents?", commandment: 5, },
    { id: 0, text: "Serious neglect of the duties of one’s state in life", commandment: 5, },
    { id: 0, text: "Serious neglect of the religious education or upbringing of children", commandment: 5, },
    { id: 0, text: "Have I mistreated my wife or children?", commandment: 5, },
    { id: 0, text: "Have I allowed them to neglect their religious duties?", commandment: 5, },
    { id: 0, text: "Have I otherwise failed to discipline them?", commandment: 5, },
    { id: 0, text: "Obeyed the reasonable demands of my teachers, if in school?", commandment: 5, },
    { id: 0, text: "Have I voted for, promoted or advanced the agenda of politicians who hold positions contrary to the common good, religious freedom, or the moral law?", commandment: 5, },
    { id: 0, text: "Have I failed to provide a good example of a virtuous life to others in my care?", commandment: 5, },
    { id: 0, text: "Have I failed to love and sacrifice for my family?", commandment: 5, },
    { id: 0, text: "Have I encouraged others to disrespect legitimate authority?", commandment: 5, },
    { id: 0, text: "Have I failed to accept my parents’ advice or admonishments?", commandment: 5, },
    { id: 0, text: "Have I failed to perform my civic duties such as voting, paying taxes, and service requirements such as jury duty, or just obligatory military service?", commandment: 5, },
    { id: 0, text: "Have I failed to promote the just treatment of the poor, indigent, or migrants in society?", commandment: 5, },
    { id: 0, text: "Have I failed in due reverence to aged persons?", commandment: 5, },
    { id: 0, text: "Have I mistreated my spouse or my children?", commandment: 5, },
    { id: 0, text: "Have I scandalized them by cursing or swearing in front of them?", commandment: 5, },
    { id: 0, text: "Did I consent, recommend, advise, approve, support or have an abortion?", commandment: 5, },
    { id: 0, text: "Have I committed an act of violence or abuse (physical, sexual, emotional or verbal)?", commandment: 5, },
    { id: 0, text: "Have I endangered the lives of others by reckless driving or by driving under the influence of drugs or alcohol?", commandment: 5, },
    { id: 0, text: "Do I show contempt for my body by neglecting to take care of my own health?", commandment: 5, },
    { id: 0, text: "Have I been mean or unjust to anyone?", commandment: 5, },
    { id: 0, text: "Have I held a grudge or sought revenge against someone who wronged me?", commandment: 5, },
    { id: 0, text: "Do I point out others’ faults and mistakes while ignoring my own?", commandment: 5, },
    { id: 0, text: "Do I complain more than I compliment?", commandment: 5, },
    { id: 0, text: "Am I ungrateful for what other people do for me?", commandment: 5, },
    { id: 0, text: "Do I tear people down rather than encourage them?", commandment: 5, },
    { id: 0, text: "Am I prejudiced against people because of their color, language or ethnic-religious background?", commandment: 5, },
    { id: 0, text: "Knowingly voting for someone who is pro-abortion?", commandment: 5, },
    { id: 0, text: "Willfully leading another into serious sin?", commandment: 5, },
    { id: 0, text: "Willfully injuring or trying to hurt another person?", commandment: 5, },
    { id: 0, text: "Driving dangerously or recklessly?", commandment: 5, },
    { id: 0, text: "Willful drunkenness?", commandment: 5, },
    { id: 0, text: "Excessive tattoos?", commandment: 5, },
    { id: 0, text: "Excessive body piercing?", commandment: 5, },
    { id: 0, text: "Serious entertainment of suicidal thoughts?", commandment: 5, },
    { id: 0, text: "Intentionally placing temptation before the weak?", commandment: 5, },
    { id: 0, text: "Have I quarreled with any one?", commandment: 5, },
    { id: 0, text: "Have I cursed anyone or otherwise wished evil on him?", commandment: 5, },
    { id: 0, text: "Is there anyone to whom I refuse to speak or be reconciled?", commandment: 5, },
    { id: 0, text: "Have I lied about anyone (calumny)?", commandment: 5, },
    { id: 0, text: "Have I taken pleasure in anyone's misfortune?", commandment: 5, },
    { id: 0, text: "Have I rash judged anyone of a serious sin?", commandment: 5, },
    { id: 0, text: "Have I engaged in gossip (detraction) or spread scandal?", commandment: 5, },
    { id: 0, text: "Have I lent an ear to scandal about my neighbor?", commandment: 5, },
    { id: 0, text: "Have I been jealous or envious of anyone?", commandment: 5, },
    { id: 0, text: "Verbally or emotionally abused another person?", commandment: 5, },
    { id: 0, text: "Unjustly threatened another person with bodily harm?", commandment: 5, },
    { id: 0, text: "Purposely provoked another by teasing or nagging?", commandment: 5, },
    { id: 0, text: "Over-eaten?", commandment: 5, },
    { id: 0, text: "Helped another to commit a mortal sin (through advice, driving them somewhere, etc.)?", commandment: 5, },
    { id: 0, text: "Indulged in serious anger?", commandment: 5, },
    { id: 0, text: "Been unforgiving to others, when mercy or pardon was requested?", commandment: 5, },
    { id: 0, text: "Sought revenge or hoped something bad would happen to someone?", commandment: 5, },
    { id: 0, text: "Have I failed to “turn the other cheek” or love my enemies?", commandment: 5, },
    { id: 0, text: "Have I failed to provide proper burial for the dead?", commandment: 5, },
    { id: 0, text: "Have I failed to show respect for the dead or their bodies?", commandment: 5, },
    { id: 0, text: "Have I advocated unjust punishments or capital punishment where it is not just?", commandment: 5, },
    { id: 0, text: "Have I mocked, intimidated or belittled someone?", commandment: 5, },
    { id: 0, text: "Have I failed to correct in Charity?", commandment: 5, },
    { id: 0, text: "Have I harmed anyone’s soul, especially children, by giving scandal through bad example?", commandment: 5, },
    { id: 0, text: "Have I failed to show respect for the dead or their bodies?", commandment: 5, },
    { id: 0, text: "Have I harmed my own soul by intentionally and without necessity exposing it to temptations, e.g.: bad TV, bad music, beaches, etc.", commandment: 5, },
    { id: 0, text: "Have I failed to show respect for the dead or their bodies?", commandment: 5, },
    { id: 0, text: "Do I view pornographic material (magazines, videos, internet, hot-lines)?", commandment: 6, },
    { id: 0, text: "Have I not avoided the occasions of sin (persons or places) which would tempt me to be unfaithful to my spouse or to my own chastity?", commandment: 6, },
    { id: 0, text: "Do I encourage and entertain impure thoughts and desires?", commandment: 6, },
    { id: 0, text: "Do I tell or listen to dirty jokes?", commandment: 6, },
    { id: 0, text: "Dressing or acting in a manner intended to cause arousal in another (spouses excepted)", commandment: 6, },
    { id: 0, text: "Kissing or touching another passionately for the purpose of arousal (spouses excepted)", commandment: 6, },
    { id: 0, text: "Allowing another to kiss or touch you in a sexual manner (spouses excepted)", commandment: 6, },
    { id: 0, text: "Intentionally causing a sexual climax outside of intercourse", commandment: 6, },
    { id: 0, text: "Oral Sex (oral stimulation permitted as foreplay in marriage - ejaculation must be vaginal)", commandment: 6, },
    { id: 0, text: "Anal sex or other degrading sex practices", commandment: 6, },
    { id: 0, text: "Willful divorce or desertion?", commandment: 6, },
    { id: 0, text: "Destroying the innocence of another by seducing or introducing them to immorality?", commandment: 6, },
    { id: 0, text: "Lust in the heart (“if I could I would”)?", commandment: 6, },
    { id: 0, text: "Have I committed masturbation or otherwise sinned impurely with myself?", commandment: 6, },
    { id: 0, text: "Do I view pornographic material (magazines, videos, internet, hot-lines)?", commandment: 6, },
    { id: 0, text: "Have I used indecent language or told indecent stories?", commandment: 6, },
    { id: 0, text: "Have I willingly listened to such stories?", commandment: 6, },
    { id: 0, text: "Have I boasted of my sins?", commandment: 6, },
    { id: 0, text: "Used an artificial means of birth control?", commandment: 6, },
    { id: 0, text: "Participated in immoral techniques for in vitro fertilization or artificial insemination?", commandment: 6, },
    { id: 0, text: "Deprived my spouse of the marital right, without just cause?", commandment: 6, },
    { id: 0, text: "Claimed my own marital right without concern for my spouse?", commandment: 6, },
    { id: 0, text: "Deliberately caused male climax outside of normal sexual intercourse? (Catechism, 2366)", commandment: 6, },
    { id: 0, text: "Purchased, viewed, or made use of pornography?", commandment: 6, },
    { id: 0, text: "Watched movies and television that involve sex and nudity?", commandment: 6, },
    { id: 0, text: "Listened to music or jokes that are harmful to purity?", commandment: 6, },
    { id: 0, text: "Committed fornication? (Sexual relations with someone of the opposite sex when neither of us is married.)", commandment: 6, },
    { id: 0, text: "Committed incest? (Sexual relations with a relative or in-law.)", commandment: 6, },
    { id: 0, text: "Committed adultery? (Sexual relations with someone who is married, or with someone other than my spouse.)", commandment: 6, },
    { id: 0, text: "Engaged in homosexual activity? (Sexual activity with someone of the same sex.)", commandment: 6, },
    { id: 0, text: "Masturbated? (Deliberate stimulation of one's own sexual organs for sexual pleasure.)", commandment: 6, },
    { id: 0, text: "Preyed upon children or youth for my sexual pleasure?", commandment: 6, },
    { id: 0, text: "Engaged in prostitution, or paid for the services of a prostitute?", commandment: 6, },
    { id: 0, text: "Made uninvited and unwelcome sexual advances toward another?", commandment: 6, },
    { id: 0, text: "Purposely dressed immodestly?", commandment: 6, },
    { id: 0, text: "Reading sexually explicit materials?", commandment: 6, },
    { id: 0, text: "Viewing pornography in books, magazines, movies, the internet, etc.", commandment: 6, },
    { id: 0, text: "Dwelling on impure thoughts or fantasies for the purpose of arousal?", commandment: 6, },
    { id: 0, text: "Have I violated someone’s privacy by spying on them?", commandment: 6, },
    { id: 0, text: "Have I failed to dress modestly or averted my eyes when someone else is dressed immodestly?", commandment: 6, },
    { id: 0, text: "Willfully entertained impure thoughts?", commandment: 6, },
    { id: 0, text: "Have I stolen any object, committed any shoplifting or cheated anyone of their money?", commandment: 7, },
    { id: 0, text: "Did I knowingly deceive someone in business or commit fraud?", commandment: 7, },
    { id: 0, text: "Have I shown disrespect or even contempt for other people’s property?", commandment: 7, },
    { id: 0, text: "Have I done any acts of vandalism?", commandment: 7, },
    { id: 0, text: "Am I greedy or envious of another’s goods?", commandment: 7, },
    { id: 0, text: "Do I let financial and material concerns or the desire for comfort override my duty to God, to Church, to my family or my own spiritual well-being?", commandment: 7, },
    { id: 0, text: "Willfully destroying or defacing another’s property", commandment: 7, },
    { id: 0, text: "Buying, selling, receiving or concealing items known to be stolen", commandment: 7, },
    { id: 0, text: "Willful failure to make restitution?", commandment: 7, },
    { id: 0, text: "Excessive gambling", commandment: 7, },
    { id: 0, text: "Defrauding workers of their wages", commandment: 7, },
    { id: 0, text: "Padding expense or per diem accounts", commandment: 7, },
    { id: 0, text: "Taking advantage of the poor, simple, inexperienced or less fortunate", commandment: 7, },
    { id: 0, text: "Denying help to the poor, needy or destitute when able to help them easily", commandment: 7, },
    { id: 0, text: "Defrauding creditors", commandment: 7, },
    { id: 0, text: "Bribery or taking bribes", commandment: 7, },
    { id: 0, text: "Blackmail", commandment: 7, },
    { id: 0, text: "Excessive waste or expense", commandment: 7, },
    { id: 0, text: "Violating copyrights", commandment: 7, },
    { id: 0, text: "Pirating computer software", commandment: 7, },
    { id: 0, text: "Serious cruelty to animals", commandment: 7, },
    { id: 0, text: "Have I refused or neglected to pay any debts?", commandment: 7, },
    { id: 0, text: "Have I neglected my duties or been slothful in my work?", commandment: 7, },
    { id: 0, text: "Considered that God has provided me with money so that I might use it to benefit others, as well as for my own legitimate needs?", commandment: 7, },
    { id: 0, text: "Freed myself from a consumer mentality?", commandment: 7, },
    { id: 0, text: "Cheated on a test, taxes, sports, games, or in business?", commandment: 7, },
    { id: 0, text: "Make a false claim to an insurance company?", commandment: 7, },
    { id: 0, text: "Paid my employees a living wage, or failed to give a full day's work for a full day's pay?", commandment: 7, },
    { id: 0, text: "Failed to honor my part of a contract?", commandment: 7, },
    { id: 0, text: "Overcharge someone, especially to take advantage of another's hardship or ignorance?", commandment: 7, },
    { id: 0, text: "Have I failed to practice the corporal works of mercy?", commandment: 7, },
    { id: 0, text: "Have I participated in or promoted an unjust strike or lockout?", commandment: 7, },
    { id: 0, text: "Have I fired someone unjustly?", commandment: 7, },
    { id: 0, text: "Have I filed or promoted an unjust lawsuit against someone?", commandment: 7, },
    { id: 0, text: "Have I shown a disregard for the environment?", commandment: 7, },
    { id: 0, text: "Have I unwisely or disproportionately spent money on animals?", commandment: 7, },
    { id: 0, text: "Have I failed to work diligently and deliver an honest day’s work to my employer?", commandment: 7, },
    { id: 0, text: "Have I failed to do the appropriate amount of work for my family?", commandment: 7, },
    { id: 0, text: "Have I been negligent in the stewardship of other people’s money or goods?", commandment: 7, },
    { id: 0, text: "Have I failed to return things borrowed?", commandment: 7, },
    { id: 0, text: "Have I been jealous of what another has?", commandment: 7, },
    { id: 0, text: "Serious failure to fulfill work requirements", commandment: 7, },
    { id: 0, text: "Have I been stingy?", commandment: 7, },
    { id: 0, text: "Have I been grasping and avaricious, placing too great importance upon material goods and comforts?", commandment: 7, },
    { id: 0, text: "Is my heart set on earthly possessions or on the true treasures of Heaven?", commandment: 7, },
    { id: 0, text: "Considered that God has provided me with money so that I might use it to benefit others, as well as for my own legitimate needs?", commandment: 7, },
    { id: 0, text: "Have I told a lie in order to deceive someone?", commandment: 8, },
    { id: 0, text: "Have I told the truth with the purpose and intention of ruining someone’s reputation (sin of detraction)?", commandment: 8, },
    { id: 0, text: "Have I told a lie or spread rumors which may ruin someone’s reputation (sin of calumny or slander)?", commandment: 8, },
    { id: 0, text: "Am I a busybody or do I love to spread gossip and secrets about others?", commandment: 8, },
    { id: 0, text: "Do I love to hear bad news about my enemies?", commandment: 8, },
    { id: 0, text: "Serious gossip, detraction (revealing the faults of another without serious reason), or calumny (harming the reputation of another by falsities)", commandment: 8, },
    { id: 0, text: "Been guilty of rash judgment? (Assuming the worst of another person based on circumstantial evidence.)", commandment: 8, },
    { id: 0, text: "Failed to make reparation for a lie I told, or for harm done to a person's reputation?", commandment: 8, },
    { id: 0, text: "Failed to speak out in defense of the Catholic Faith, the Church, or of another person?", commandment: 8, },
    { id: 0, text: "Have I been a hypocrite?", commandment: 8, },
    { id: 0, text: "Have I prevented others from speaking the truth?", commandment: 8, },
    { id: 0, text: "Have I been boastful or arrogant?", commandment: 8, },
    { id: 0, text: "Have I mischaracterized something, been overly dramatic, constructed false (straw-man) arguments or engaged in ad-hominem attacks (attacks against the person rather than the argument or viewpoint)?", commandment: 8, },
    { id: 0, text: "Have I promoted false public information (propaganda)?", commandment: 8, },
    { id: 0, text: "Have my lies caused them any material or spiritual harm??", commandment: 8, },
    { id: 0, text: "Have I been guilty of talebearing, (i.e. reporting something unfavorable said of someone by another so as to create enmity between them)?", commandment: 8, },
    { id: 0, text: "Have I lent an ear to or encouraged the spreading of scandal about my neighbor?", commandment: 8, },
];
