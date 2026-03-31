app.controller('CartController', function($scope, CartService) {

    $scope.cartItems = [];

    function loadCart() {
        CartService.getCart()
        .then(function(res) {
            // API returns { message, cart } or empty array
            if (Array.isArray(res.data.cart)) {
                $scope.cartItems = [];
            } else if (res.data.cart && res.data.cart.items) {
                $scope.cartItems = res.data.cart.items;
            } else {
                $scope.cartItems = [];
            }
        })
        .catch(function(err) {
            console.log(err);
        });
    }

    loadCart();

});