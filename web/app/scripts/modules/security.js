(function () {
    'use strict';

    const JWT_SESSION_KEY = 'stbgfc.security.jwt';
    var loginModal;

    angular
        .module('stbgfc.security', [
            'angularLocalStorage',
            'http-auth-interceptor',
            'mgcrea.ngStrap.modal'
        ])

        .run(function($rootScope, $http, $window, $modal) {

            var savedJwtToken = $window.sessionStorage.getItem(JWT_SESSION_KEY);
            if (savedJwtToken) {
                $http.defaults.headers.common.Authorization = 'Bearer ' + savedJwtToken;
            }

            loginModal= $modal({
                template: 'views/modal-login.html',
                controller: 'LoginController',
                show: false,
                persist: true
            });

            $rootScope.$on('event:auth-loginRequired', function() {
                loginModal.$promise.then(loginModal.show);
            });
        })

        // ============================================================================================
        // controllers
        // ============================================================================================

        .controller('LoginController', function(LoginService, $scope) {

            $scope.username = '';
            $scope.password = '';

            $scope.doLogin = function() {
                LoginService.authenticate($scope.username, $scope.password);
                loginModal.hide();
            };

            $scope.closeLogin = function() {
                LoginService.cancel();
                loginModal.hide();
            };

            $scope.logout = function () {
                LoginService.logout();
                $scope.username = '';
                $scope.password = '';
            };
        })


        // ============================================================================================
        // services
        // ============================================================================================

        .factory('LoginService', function($rootScope, $http, $window, authService) {
            return {
                authenticate: function(user, pwd) {
                    $http.post('/authenticate', {username: user, password: pwd})
                        .success(function(data) {
                            $http.defaults.headers.common.Authorization = 'Bearer ' + data.token;
                            $window.sessionStorage.setItem(JWT_SESSION_KEY, data.token);
                            authService.loginConfirmed('success', function(config){
                                config.headers.Authorization = 'Bearer ' + data.token;
                                return config;
                            });
                        })
                        .error(function(data, status) {
                            this.logout();
                            console.error(data, status);
                        });
                },

                cancel: function() {
                    authService.loginCancelled();
                },

                logout: function() {
                    $http.defaults.headers.common.Authorization = null;
                    $window.sessionStorage.setItem(JWT_SESSION_KEY, null);
                    $rootScope.$broadcast('event:auth-loginCleared');
                }
            };
        })
    ;
})();

