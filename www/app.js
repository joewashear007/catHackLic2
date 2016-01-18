angular.module('catHacklic', ['ionic', 'catHacklic.examin'])
    .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('home', { url: '/', templateUrl: 'templates/home.html' })
        .state('examin', { url: '/examen', abstract: true, template: '<ion-nav-view></ion-nav-view>' })
        .state('examin.home', { url: '', templateUrl: 'examin/templates/index.html', controller: 'ExaminCtrl as ctrl' })
        .state('examin.s0', { url: '/s0', templateUrl: 'examin/templates/s0.html', controller: 'ExaminS0Ctrl as ctrl' })
        .state('examin.s1', { url: '/s1', templateUrl: 'examin/templates/s1.html', controller: 'ExaminS1Ctrl as ctrl' })
        .state('examin.s2', { url: '/s2', templateUrl: 'examin/templates/s2.html', controller: 'ExaminS2Ctrl as ctrl' })
        .state('examin.review', { url: '/review', templateUrl: 'examin/templates/review.html', controller: 'ReviewCtrl as ctrl' });
    $urlRouterProvider.otherwise('/');
})
    .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            window.StatusBar.styleDefault();
        }
    });
});

var HomeCtrl = (function () {
    function HomeCtrl() {
    }
    return HomeCtrl;
}());
angular.module('catHacklic')
    .controller('homeCtrl', HomeCtrl)
    .controller('reviewCtrl', function ($scope, $state, ItemService) {
    $scope.summary = ItemService.summary(['blessing', 'ask', 'kill', 'embrace', 'resolution']);
    $scope.save = function () {
        ItemService.save();
        $state.go('home');
    };
    $scope.clear = function () {
        ItemService.clear();
    };
    $scope.$on('ItemService', function () {
        $scope.summary = ItemService.summary(['blessing', 'ask', 'kill', 'embrace', 'resolution']);
    });
})
    .controller('historyCtrl', function ($scope) {
})
    .controller('historyItemCtrl', function ($scope) {
});

angular.module('app.directives', [])
    .directive('blankDirective', [function () {
    }]);


var catHacklic;
(function (catHacklic) {
    catHacklic.Paths = {
        userinfo: 'v1.userinfo',
        common: 'v1.commonItems'
    };
    var UserSerivce = (function () {
        function UserSerivce() {
            this._userInfo = JSON.parse(localStorage['v1.userinfo'] || "{}");
        }
        Object.defineProperty(UserSerivce.prototype, "user", {
            get: function () { return this._userInfo; },
            set: function (user) {
                localStorage[catHacklic.Paths.userinfo] = JSON.stringify(user);
                this._userInfo = user;
            },
            enumerable: true,
            configurable: true
        });
        UserSerivce.$inject = [];
        return UserSerivce;
    }());
    catHacklic.UserSerivce = UserSerivce;
})(catHacklic || (catHacklic = {}));
angular.module('catHacklic')
    .service('UserSerivce', catHacklic.UserSerivce);
