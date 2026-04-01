app.service('AdminService', function($http, AuthService) {

    var foodBaseUrl = "http://localhost:5000/api/food";
    var orderBaseUrl = "http://localhost:5000/api/order";
    var userBaseUrl = "http://localhost:5000/api/users"; // will be used if backend users API exists

    function authConfig() {
        var token = AuthService.getToken();
        return {
            headers: {
                authorization: token || ''
            }
        };
    }

    // Food (admin)
    this.addFood = function(food) {
        return $http.post(foodBaseUrl + "/add", food, authConfig());
    };

    this.updateFood = function(id, food) {
        return $http.put(foodBaseUrl + "/update/" + id, food, authConfig());
    };

    this.deleteFood = function(id) {
        return $http.delete(foodBaseUrl + "/delete/" + id, authConfig());
    };

    // Orders (admin)
    this.getAllOrders = function() {
        return $http.get(orderBaseUrl + "/all", authConfig());
    };

    this.updateOrderStatus = function(id, status) {
        return $http.put(orderBaseUrl + "/status/" + id, { status: status }, authConfig());
    };

    // Users (admin) - optional, only works if /api/users is implemented on backend
    this.getUsers = function() {
        return $http.get(userBaseUrl, authConfig());
    };

    this.updateUserStatus = function(id, status) {
        return $http.put(userBaseUrl + "/" + id + "/status", { status: status }, authConfig());
    };

});