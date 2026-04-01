app.controller('CheckoutController', function($scope, CartService, AuthService, $location, OrderService, ToastService) {

    // Load cart items from CartService (same as in CartController)
    $scope.cart = CartService.getCart();

    // Basic delivery details model (auto-filled from profile when possible)
    $scope.user = {
        name: '',
        address: '',
        phone: ''
    };

    // Auto-fill delivery details from user profile if logged in
    if (AuthService.isAuthenticated()) {
        AuthService.getProfile()
            .then(function(res) {
                if (res.data && res.data.user) {
                    var u = res.data.user;
                    $scope.user.name = u.name || '';
                    $scope.user.address = u.address || '';
                    $scope.user.phone = u.phone || '';
                }
            })
            .catch(function() {
                // Ignore errors and let user fill manually
            });
    }

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
        if (!$scope.cart || !$scope.cart.length) {
            alert("Your cart is empty");
            return;
        }

        var payload = {
            items: $scope.cart.map(function(item) {
                return {
                    foodId: item._id,
                    quantity: item.quantity || 1
                };
            }),
            totalAmount: $scope.getTotal()
        };

        OrderService.placeOrder(payload)
            .then(function() {
                CartService.clearCart();
                $scope.orderSuccess = true;
                if (ToastService && ToastService.success) {
                    ToastService.success("Order placed successfully");
                }
            })
            .catch(function(err) {
                console.error('Error placing order', err);
                alert("Failed to place order. Please try again.");
            });
    };

    $scope.goHome = function() {
    window.location.href = "#!/home";
    };
    
});