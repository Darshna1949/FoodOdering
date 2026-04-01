var app = angular.module('foodApp', ['ngRoute']);

app.config(function($routeProvider) {
    $routeProvider
    .when('/', {
        redirectTo: '/home'
    })
    .when('/login', {
        templateUrl: 'views/user/login.html',
        controller: 'AuthController'
    })
    .when('/home', {
        templateUrl: 'views/user/home.html',
        controller: 'FoodController'
    })
    .when('/cart', {
        templateUrl: 'views/user/cart.html',
        controller: 'CartController'
    })
    .when('/checkout', {
    templateUrl: 'views/user/checkout.html',
    controller: 'CheckoutController'
    })
    .when('/profile', {
        templateUrl: 'views/user/profile.html',
        controller: 'ProfileController'
    })
    .when('/orders', {
    templateUrl: 'views/user/orders.html',
    controller: 'OrderController'
    })
    .when('/admin', {
    templateUrl: 'views/admin/layout.html',
    controller: 'AdminController'
    })
    .otherwise({
        redirectTo: '/home'
    });
});

// Optional: clear token on full reload if you want a fresh session
app.run(function(AuthService) {
    // If you want users to always start logged out on browser refresh,
    // uncomment the next line:
    // AuthService.logout();
});