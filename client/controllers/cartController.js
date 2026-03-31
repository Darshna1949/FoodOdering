app.controller('CartController', function($scope, CartService) {

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

});