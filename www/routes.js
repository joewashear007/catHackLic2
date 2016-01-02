angular.module('catHacklic.routes', [])
    .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('home', { url: '/', templateUrl: 'templates/home.html', controller: 'homeCtrl' })
        .state('examination', { url: '/examen', abstract: true, templateUrl: 'examin/templates/index.html' })
        .state('examination.blessings', {
        url: '/blessing',
        views: {
            'tab10': {
                templateUrl: 'examin/templates/blessings.html',
                controller: 'blessingsCtrl as blessing'
            }
        }
    })
        .state('examination.ask', {
        url: '/ask',
        views: {
            'tab11': {
                templateUrl: 'templates/examination/ask.html',
                controller: 'askCtrl'
            }
        }
    })
        .state('examination.kill', {
        url: '/kill',
        views: {
            'tab12': {
                templateUrl: 'templates/examination/kill.html',
                controller: 'killCtrl'
            }
        }
    })
        .state('examination.embrace', {
        url: '/embrace',
        views: {
            'tab13': {
                templateUrl: 'templates/examination/embrace.html',
                controller: 'embraceCtrl'
            }
        }
    })
        .state('examination.resolution', {
        url: '/resolution',
        views: {
            'tab14': {
                templateUrl: 'templates/examination/resolution.html',
                controller: 'resolutionCtrl'
            }
        }
    })
        .state('examination.review', {
        url: '/review',
        views: {
            'tab15': {
                templateUrl: 'templates/examination/review.html',
                controller: 'reviewCtrl'
            }
        }
    })
        .state('history', {
        url: '/examen/history',
        templateUrl: 'templates/history.html',
        controller: 'historyCtrl'
    })
        .state('historyItem', {
        url: '/examen/history/item',
        templateUrl: 'templates/historyItem.html',
        controller: 'historyItemCtrl'
    });
    $urlRouterProvider.otherwise('/');
});
