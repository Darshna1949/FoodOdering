app.controller('FoodController', function($scope, $location, FoodService, CartService) {

    $scope.foods = [];
    $scope.allFoods = [];
    $scope.searchText = "";
    $scope.activeCategory = "All";

    function getImage(name, backendImage) {
        // Prefer backend image if it's a valid URL, otherwise fallback to Unsplash
        if (backendImage && backendImage.indexOf('http') === 0) {
            return backendImage;
        }
        return "https://source.unsplash.com/400x300/?food," + name;
    }

    FoodService.getFoods()
        .then(function(res) {

            // Backend returns: { message: '...', foods: [...] }
            var list = res.data && res.data.foods ? res.data.foods : res.data;

            $scope.allFoods = (list || []).map(function(item) {
                return {
                    name: item.name,
                    price: item.price,
                    description: item.description,
                    category: item.category,
                    image: getImage(item.name, item.image)
                };
            });

            // initial view
            $scope.foods = $scope.allFoods;

            console.log($scope.foods);

        })
        .catch(function(err) {
            console.log('Error loading foods', err);
        });

    $scope.addToCart = function(item) {
        CartService.addToCart(item);
        alert(item.name + " added to cart");
    };

    $scope.goToCart = function() {
        $location.path('/cart');
    };

    $scope.goToLogin = function() {
        $location.path('/login');
    };

    function applyFilters() {
        var filtered = $scope.allFoods;

        if ($scope.activeCategory && $scope.activeCategory !== 'All') {
            filtered = filtered.filter(function(item) {
                return item.category && item.category.toLowerCase() === $scope.activeCategory.toLowerCase();
            });
        }

        if ($scope.searchText) {
            var term = $scope.searchText.toLowerCase();
            filtered = filtered.filter(function(item) {
                return item.name.toLowerCase().indexOf(term) !== -1 ||
                       (item.description || '').toLowerCase().indexOf(term) !== -1;
            });
        }

        $scope.foods = filtered;
    }

    $scope.setCategory = function(category) {
        $scope.activeCategory = category;
        applyFilters();
    };

    $scope.onSearchChange = function() {
        applyFilters();
    };

});