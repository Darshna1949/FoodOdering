app.controller('FoodController', function($scope, $location, FoodService, CartService, AuthService, ToastService) {

    var backendBaseUrl = 'http://localhost:5000';

    $scope.foods = [];
    $scope.allFoods = [];
    $scope.categoryList = ['All'];
    $scope.searchText = "";
    $scope.activeCategory = "All";
    $scope.cartCount = CartService.getCartCount();
    $scope.isLoggedIn = AuthService.isAuthenticated();

    function getImage(name, backendImage) {
        // Prefer backend image when provided. Support full URLs, protocol-relative URLs,
        // relative upload paths, and data/blob URLs; only fall back when no image exists.
        if (!backendImage) {
            return "https://source.unsplash.com/400x300/?food," + name;
        }

        if (backendImage.indexOf('http://') === 0 || backendImage.indexOf('https://') === 0 ||
            backendImage.indexOf('//') === 0 || backendImage.indexOf('data:') === 0 ||
            backendImage.indexOf('blob:') === 0) {
            return backendImage;
        }

        if (backendImage.charAt(0) === '/') {
            return backendBaseUrl + backendImage;
        }

        return backendBaseUrl + '/' + backendImage.replace(/^\.\//, '');
    }

    function normalizeCategory(value) {
        return (value || '').toString().trim();
    }

    function buildCategories(list) {
        var seen = {};
        var categories = ['All'];

        (list || []).forEach(function(item) {
            var category = normalizeCategory(item.category);

            if (!category) {
                return;
            }

            var key = category.toLowerCase();
            if (!seen[key]) {
                seen[key] = true;
                categories.push(category);
            }
        });

        $scope.categoryList = categories;
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
                    category: normalizeCategory(item.category),
                    type: item.type || '',
                    image: getImage(item.name, item.image)
                };
            });

            buildCategories($scope.allFoods);

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
                var itemCategory = normalizeCategory(item.category);

                if (!itemCategory) {
                    return false;
                }

                var cat = itemCategory.toLowerCase();
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

    $scope.isActiveCategory = function(category) {
        return ($scope.activeCategory || '').toLowerCase().trim() === (category || '').toLowerCase().trim();
    };

    $scope.onSearchChange = function() {
        applyFilters();
    };

});