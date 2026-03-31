app.controller('FoodController', function($scope, $location, FoodService) {

    $scope.foods = [];

    // Fetch food items
    FoodService.getFoods()
    .then(function(res) {
        $scope.foods = res.data;
    })
    .catch(function(err) {
        console.log(err);
    });

    // Add to cart (temporary)
    $scope.addToCart = function(item) {
        alert(item.name + " added to cart");
    };

    $scope.goToCart = function() {
        $location.path('/cart');
    };
});