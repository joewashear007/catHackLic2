angular.module('catHacklic', ['ionic', 'catHacklic.examin'])
    .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('home', { url: '/', templateUrl: 'templates/home.html' })
        .state('examination', { url: '/examen', templateUrl: 'examin/templates/index.html', controller: 'ExaminCtrl as ctrl' });
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
