app.controller('CheckoutController', function($scope, CartService, AuthService, $location) {

    // Load cart items from CartService (same as in CartController)
    $scope.cart = CartService.getCart();

    // Basic delivery details model
    $scope.user = {
        name: '',
        address: '',
        phone: ''
    };

    // Reuse the same total calculation logic used in CartController
    $scope.getTotal = function() {
        return $scope.cart.reduce(function(total, item) {
            return total + (item.price * item.quantity);
        }, 0);
    };

    $scope.orderSuccess = false;

    $scope.placeOrder = function() {

        if (!$scope.user.name || !$scope.user.address || !$scope.user.phone) {
            alert("Please fill all details");
            return;
        }

        // Optionally, block direct access to checkout when not logged in
        if (!AuthService.isAuthenticated()) {
            alert("Please login before placing an order");
            $location.path('/login');
            return;
        }

        let orders = JSON.parse(localStorage.getItem('orders')) || [];

        let newOrder = {
            id: Date.now(),
            // deep copy the cart so later changes don't affect past orders
            items: JSON.parse(JSON.stringify($scope.cart)),
            total: $scope.getTotal(),
            user: $scope.user,
            date: new Date().toLocaleString()
        };

        orders.push(newOrder);

        localStorage.setItem('orders', JSON.stringify(orders));

        // Clear cart via CartService so all views update
        CartService.clearCart();

        // 🔥 SHOW MODAL
        $scope.orderSuccess = true;
    };

    $scope.goHome = function() {
    window.location.href = "#!/home";
    };
    
});