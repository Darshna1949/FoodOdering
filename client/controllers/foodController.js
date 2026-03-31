app.controller('FoodController', function($scope, $location, FoodService, CartService) {

    $scope.foods = [];

    // Fetch food items
    FoodService.getFoods()
    .then(function(res) {
        // API returns { message, foods: [...] }
        $scope.foods = res.data.foods;
    })
    .catch(function(err) {
        console.log(err);
    });

    // Add to cart via backend
    $scope.addToCart = function(item) {
        CartService.addToCart(item._id)
        .then(function(res) {
            alert(item.name + " added to cart");
        })
        .catch(function(err) {
            console.log(err);
            alert("Please login again to add items to cart.");
            $location.path('/login');
        });
    };

    $scope.goToCart = function() {
        $location.path('/cart');
    };
});