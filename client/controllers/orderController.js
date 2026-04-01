app.controller('OrderController', function($scope, $location, AuthService, OrderService, ToastService) {

    // Redirect to login if not authenticated
    if (!AuthService.isAuthenticated()) {
        $location.path('/login');
        return;
    }

    $scope.orders = [];

    function mapOrders(rawOrders) {
        return (rawOrders || []).map(function(order) {
            return {
                id: order._id,
                date: order.createdAt ? new Date(order.createdAt).toLocaleString() : '',
                total: order.totalAmount || 0,
                items: (order.items || []).map(function(item) {
                    var food = item.foodId || {};
                    return {
                        name: food.name || 'Item',
                        quantity: item.quantity || 0,
                        price: food.price || 0
                    };
                })
            };
        });
    }

    function loadOrders() {
        OrderService.getMyOrders()
            .then(function(res) {
                var list = res.data && res.data.order ? res.data.order : res.data;
                $scope.orders = mapOrders(list);
            })
            .catch(function(err) {
                console.error('Error loading user orders', err);
                if (ToastService && ToastService.error) {
                    ToastService.error('Failed to load orders');
                }
            });
    }

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

    loadOrders();

});