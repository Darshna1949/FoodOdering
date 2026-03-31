app.controller('OrderController', function($scope, $location) {

    $scope.orders = JSON.parse(localStorage.getItem('orders')) || [];

    // Navigate
    $scope.goHome = function() {
        $location.path('/home');
    };

    $scope.goProfile = function() {
        $location.path('/profile');
    };

    $scope.goCart = function() {
        $location.path('/cart');
    };

});