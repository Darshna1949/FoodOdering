app.controller('CartController', function($scope, CartService, AuthService, $location) {

    $scope.cart = CartService.getCart();

    $scope.removeItem = function(index) {
        CartService.removeItem(index);
    };

    $scope.updateQuantity = function(index, change) {
        CartService.updateQuantity(index, change);
    };

    $scope.getTotal = function() {
        return $scope.cart.reduce(function(total, item) {
            return total + (item.price * item.quantity);
        }, 0);
    };

    $scope.goToCheckout = function() {
        if (!AuthService.isAuthenticated()) {
            alert("Please login before proceeding to checkout");
            $location.path('/login');
            return;
        }

        $location.path('/checkout');
    };

});