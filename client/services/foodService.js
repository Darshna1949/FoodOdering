app.service('FoodService', function($http) {

    var baseUrl = "http://localhost:5000/api/food";

    this.getFoods = function() {
        return $http.get(baseUrl);
    };
});