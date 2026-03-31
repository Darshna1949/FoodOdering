var app = angular.module('foodApp', ['ngRoute']);

app.config(function($routeProvider) {
    $routeProvider
    .when('/', {
        redirectTo: '/home'
    })
    .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'AuthController'
    })
    .when('/home', {
        templateUrl: 'views/home.html',
        controller: 'FoodController'
    })
    .when('/cart', {
        templateUrl: 'views/cart.html',
        controller: 'CartController'
    })
    .otherwise({
        redirectTo: '/home'
    });
});