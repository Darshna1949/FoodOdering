app.controller('NavController', function($scope, $location, CartService, AuthService) {

    function refreshState() {
        $scope.cartCount = CartService.getCartCount();
        $scope.isLoggedIn = AuthService.isAuthenticated();
    }

    refreshState();

    $scope.goHome = function() {
        $location.path('/home');
    };

    $scope.goToCart = function() {
        $location.path('/cart');
    };

    $scope.goToLogin = function() {
        $location.path('/login');
    };

    $scope.goToProfile = function() {
        $location.path('/profile');
    };

    // Update navbar state when route changes (e.g., cart updated elsewhere)
    $scope.$on('$routeChangeSuccess', function() {
        refreshState();
    });

});