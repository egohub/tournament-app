(function() {
    'use strict';

    angular
        .module('stbgfc.tournament-app', [
            'stbgfc.tournament',
            'stbgfc.security',
            'viewtitle',
            'loadingspinner',
            'ui.router',
            'ngAnimate'
        ])

        .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state('home', {
                    url: '/',
                    templateUrl: 'views/home.html'
                })
                .state('resultsGroup', {
                    url: '/results/:name/:section/:group',
                    templateUrl: 'views/results.html',
                    controller: 'ResultsController'
                })
                .state('results', {
                    url: '/results/:name/:section',
                    templateUrl: 'views/results.html',
                    controller: 'ResultsController'
                })
                .state('newsList', {
                    url: '/news',
                    templateUrl: 'views/news.html',
                    controller: 'NewsListController'
                })
                .state('feedback', {
                    url: '/feedback',
                    templateUrl: 'views/feedback.html'
                })
                .state('editresult', {
                    url: '/results/:id',
                    templateUrl: 'views/admin/editresult.html',
                    controller: 'ResultEditController'
                })
                .state('page', {
                    url: '/page/:id',
                    templateUrl: 'views/page.html',
                    controller: 'PageController'
                })
                // admin views
                .state('admin', {
                    url: '/admin',
                    templateUrl: 'views/admin/main.html'
                })
                .state('admin.feedback', {
                    url: '/feedback',
                    templateUrl: 'views/admin/viewfeedback.html',
                    controller: 'FeedbackAdminController'
                })
                .state('admin.createnews', {
                    url: '/createnews',
                    templateUrl: 'views/admin/createnews.html',
                    controller: 'NewsAdminController'
                })
                .state('admin.createcompetition', {
                    url: '/createcompetition',
                    templateUrl: 'views/admin/createcompetition.html'
                })
                .state('admin.pageeditor', {
                    url: '/pages',
                    templateUrl: 'views/admin/pages.html',
                    controller: 'PageAdminController'
                })
                .state('admin.scorecard', {
                    url: '/scorecard',
                    templateUrl: 'views/admin/scorecard.html',
                    controller: 'ScoreCardController'
                })
            ;

            $urlRouterProvider.when('', '/');

        }])

        .run(function ($rootScope, $state, $stateParams, $log, broadcastSocket) {

            // ensure the factory is init'd as we never use it directly
            $log.info(broadcastSocket);

            // Add references to $state and $stateParams to the $rootScope
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        })
    ;
})();

