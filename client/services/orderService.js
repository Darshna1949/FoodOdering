app.service('OrderService', function($http, AuthService) {

    var baseUrl = "http://localhost:5000/api/order";

    function authConfig() {
        var token = AuthService.getToken();
        return {
            headers: {
                authorization: token || ''
            }
        };
    }

    this.placeOrder = function(orderPayload) {
        return $http.post(baseUrl + "/place", orderPayload, authConfig());
    };

    this.getMyOrders = function() {
        return $http.get(baseUrl + "/", authConfig());
    };

});