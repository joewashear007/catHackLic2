angular.module('catHacklic', ['ionic', 'catHacklic.examin'])
    .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('home', { url: '/', templateUrl: 'templates/home.html' })
        .state('examination', { url: '/examen', abstract: true, templateUrl: 'examin/templates/index.html' })
        .state('examination.blessings', {
        url: '/blessing',
        views: { 'tab10': { templateUrl: 'examin/templates/blessings.html', controller: 'BlessingCtrl as ctrl' } }
    })
        .state('examination.ask', {
        url: '/ask',
        views: { 'tab11': { templateUrl: 'examin/templates/ask.html', controller: 'AskCtrl as ctrl' } }
    })
        .state('examination.kill', {
        url: '/kill',
        views: { 'tab12': { templateUrl: 'examin/templates/kill.html', controller: 'KillCtrl sa ctrl' } }
    })
        .state('examination.embrace', {
        url: '/embrace',
        views: { 'tab13': { templateUrl: 'examin/templates/embrace.html', controller: 'EmbraceCtrl as ctrl' } }
    })
        .state('examination.resolution', {
        url: '/resolution',
        views: { 'tab14': { templateUrl: 'examin/templates/resolution.html', controller: 'ResolutionCtrl as ctrl' } }
    })
        .state('examination.review', {
        url: '/review',
        views: { 'tab15': { templateUrl: 'examin/templates/review.html', controller: 'ReviewCtrl as ctrl' } }
    });
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
