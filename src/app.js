angular.module('catHacklic', ['ionic', 'catHacklic.examin'])
    .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('home', { url: '/', templateUrl: 'templates/home.html' })
        .state('examin', { url: '/examen', abstract: true, template: '<ion-nav-view></ion-nav-view>' })
        .state('examin.home', { url: '', templateUrl: 'examin/templates/index.html', controller: 'ExaminCtrl as ctrl' })
        .state('examin.s0', { url: '/s0', templateUrl: 'examin/templates/s0.html', controller: 'ExaminS0Ctrl as ctrl' })
        .state('examin.s1', { url: '/s1', templateUrl: 'examin/templates/s1.html', controller: 'ExaminS1Ctrl as ctrl' })
        .state('examin.s2', { url: '/s2', templateUrl: 'examin/templates/s2.html', controller: 'ExaminS2Ctrl as ctrl' })
        .state('examin.s3', { url: '/s3', templateUrl: 'examin/templates/s3.html', controller: 'ExaminS3Ctrl as ctrl' })
        .state('examin.s4', { url: '/s4', templateUrl: 'examin/templates/s4.html', controller: 'ExaminS4Ctrl as ctrl' })
        .state('examin.s5', { url: '/s5', templateUrl: 'examin/templates/s5.html', controller: 'ExaminS5Ctrl as ctrl' })
        .state('examin.s6', { url: '/s6', templateUrl: 'examin/templates/s6.html', controller: 'ExaminS6Ctrl as ctrl' })
        .state('examin.s7', { url: '/s7', templateUrl: 'examin/templates/s7.html', controller: 'ExaminS7Ctrl as ctrl' })
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
