angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'templates/home.html',
      controller: 'homeCtrl'
    })
    .state('examination', {
      url: '/examen',
      abstract:true,
      templateUrl: 'templates/examination.html'
    })
    .state('examination.blessings', {
      url: '/blessing',
      views: {
        'tab10': {
          templateUrl: 'templates/examination/blessings.html',
          controller: 'blessingsCtrl'
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
    })
    ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');

});
