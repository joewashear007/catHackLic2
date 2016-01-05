/// <reference path="../typings/tsd.d.ts" />


// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('catHacklic', ['ionic', 'catHacklic.examin'])
  .config(function($stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider) {
  $stateProvider
    .state('home', { url: '/', templateUrl: 'templates/home.html' })
    .state('examin', { url: '/examen', abstract: true,  template: '<ion-nav-view></ion-nav-view>'})
    .state('examin.take', { url: '', templateUrl: 'examin/templates/index.html', controller: 'ExaminCtrl as ctrl' })
    .state('examin.review', { url: '/review', templateUrl: 'examin/templates/review.html', controller: 'ReviewCtrl as ctrl' })
;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');

})

  .run(function($ionicPlatform: ionic.platform.IonicPlatformService) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      window.StatusBar.styleDefault();
    }
  });
})
