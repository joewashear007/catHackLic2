angular.module('catHacklic', ['ionic', 'catHacklic.examin'])
    .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('home', { url: '/', templateUrl: 'templates/home.html' })
        .state('examin', { url: '/examen', abstract: true, template: '<ion-nav-view></ion-nav-view>' })
        .state('examin.take', { url: '', templateUrl: 'examin/templates/index.html', controller: 'ExaminCtrl as ctrl' })
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
