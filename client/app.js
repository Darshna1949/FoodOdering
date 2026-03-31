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
    .when('/checkout', {
    templateUrl: 'views/checkout.html',
    controller: 'CheckoutController'
    })
    .when('/profile', {
        templateUrl: 'views/profile.html',
        controller: 'ProfileController'
    })
    .when('/orders', {
    templateUrl: 'views/orders.html',
    controller: 'OrderController'
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