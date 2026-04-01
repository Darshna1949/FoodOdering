app.controller('NavController', function($scope, $location, CartService, AuthService) {

    $scope.showProfileMenu = false;

    function refreshState() {
        $scope.cartCount = CartService.getCartCount();
        $scope.isLoggedIn = AuthService.isAuthenticated();
        if (!$scope.isLoggedIn) {
            $scope.showProfileMenu = false;
        }
    }

    refreshState();

    // Show navbar on all pages except login and admin
    $scope.shouldShowNavbar = function() {
        var path = $location.path();
        return path !== '/login' && path !== '/admin';
    };

    $scope.goHome = function() {
        $location.path('/home');
    };

    $scope.goToCart = function() {
        $location.path('/cart');
    };

    $scope.goToLogin = function() {
        $location.path('/login');
    };

    $scope.toggleProfileMenu = function() {
        $scope.showProfileMenu = !$scope.showProfileMenu;
    };

    $scope.goToProfile = function() {
        $scope.showProfileMenu = false;
        $location.path('/profile');
    };

    $scope.goToOrders = function() {
        $scope.showProfileMenu = false;
        $location.path('/orders');
    };

    $scope.logout = function() {
        AuthService.logout();
        refreshState();
        $scope.showProfileMenu = false;
        $location.path('/login');
    };

    // Update navbar state when route changes (e.g., cart updated elsewhere)
    $scope.$on('$routeChangeSuccess', function() {
        refreshState();
    });

    // Update when cart changes anywhere in the app
    $scope.$on('cartUpdated', function() {
        refreshState();
    });

});