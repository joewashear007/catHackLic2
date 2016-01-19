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
    .state('examin.home', { url: '', templateUrl: 'examin/templates/index.html', controller: 'ExaminCtrl as ctrl' })
    .state('examin.s0', { url: '/s0', templateUrl: 'examin/templates/s0.html', controller: 'ExaminS0Ctrl as ctrl' })
    .state('examin.s1', { url: '/s1', templateUrl: 'examin/templates/s1.html', controller: 'ExaminS1Ctrl as ctrl' })
    .state('examin.s2', { url: '/s2', templateUrl: 'examin/templates/s2.html', controller: 'ExaminS2Ctrl as ctrl' })
    .state('examin.s3', { url: '/s3', templateUrl: 'examin/templates/s3.html', controller: 'ExaminS3Ctrl as ctrl' })
    .state('examin.s4', { url: '/s4', templateUrl: 'examin/templates/s4.html', controller: 'ExaminS4Ctrl as ctrl' })
    .state('examin.s5', { url: '/s5', templateUrl: 'examin/templates/s5.html', controller: 'ExaminS5Ctrl as ctrl' })
    .state('examin.s6', { url: '/s6', templateUrl: 'examin/templates/s6.html', controller: 'ExaminS6Ctrl as ctrl' })
    .state('examin.s7', { url: '/s7', templateUrl: 'examin/templates/s7.html', controller: 'ExaminS7Ctrl as ctrl' })
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
