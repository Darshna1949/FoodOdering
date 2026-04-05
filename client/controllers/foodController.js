app.controller('FoodController', function($scope, $location, FoodService, CartService, AuthService, ToastService) {

    $scope.foods = [];
    $scope.allFoods = [];
    $scope.searchText = "";
    $scope.activeCategory = "All";
    $scope.cartCount = CartService.getCartCount();
    $scope.isLoggedIn = AuthService.isAuthenticated();

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
                    _id: item._id,
                    name: item.name,
                    price: item.price,
                    description: item.description,
                    category: item.category,
                    type: item.type || '',
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
        // Allow both logged-in and guest users to add items to cart.
        // Checkout and order placement are still protected elsewhere.
        CartService.addToCart(item);
        $scope.cartCount = CartService.getCartCount();
        ToastService.success(item.name + " added to cart");
    };

    $scope.goToCart = function() {
        $location.path('/cart');
    };

    $scope.goToLogin = function() {
        $location.path('/login');
    };

    $scope.goToProfile = function() {
        $location.path('/profile');
    };

    function applyFilters() {
        var filtered = $scope.allFoods;

        if ($scope.activeCategory && $scope.activeCategory !== 'All') {
            filtered = filtered.filter(function(item) {
                if (!item.category) {
                    return false;
                }

                var cat = (item.category || '').toLowerCase().trim();
                var active = ($scope.activeCategory || '').toLowerCase().trim();

                // Match if the stored category contains the active label,
                // so values like "Veg Pizza" or "pizza " still match "Pizza".
                return cat.indexOf(active) !== -1;
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