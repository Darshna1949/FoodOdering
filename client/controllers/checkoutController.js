app.controller('CheckoutController', function($scope, CartService) {

    $scope.cart = CartService.getCart();

    $scope.user = {
        name: '',
        address: '',
        phone: ''
    };

    $scope.getTotal = function() {
        return $scope.cart.reduce(function(total, item) {
            return total + (item.price * item.quantity);
        }, 0);
    };

    $scope.placeOrder = function() {
        if (!$scope.user.name || !$scope.user.address || !$scope.user.phone) {
            alert("Please fill all details");
            return;
        }

        alert("Order placed successfully 🎉");

        localStorage.removeItem('cart');
        $scope.cart = [];
    };

});