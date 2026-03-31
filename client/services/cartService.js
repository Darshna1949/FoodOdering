app.service('CartService', function($http) {

	var baseUrl = "http://localhost:5000/api/cart";

	function getAuthHeaders() {
		var token = localStorage.getItem('token');
		return token ? { Authorization: token } : {};
	}

	this.addToCart = function(foodId) {
		return $http.post(baseUrl + "/add", { foodId: foodId }, {
			headers: getAuthHeaders()
		});
	};

	this.getCart = function() {
		return $http.get(baseUrl + "/", {
			headers: getAuthHeaders()
		});
	};

	this.updateQuantity = function(foodId, quantity) {
		return $http.put(baseUrl + "/update", { foodId: foodId, quantity: quantity }, {
			headers: getAuthHeaders()
		});
	};

	this.removeItem = function(foodId) {
		return $http({
			method: 'DELETE',
			url: baseUrl + "/remove",
			data: { foodId: foodId },
			headers: Object.assign({ 'Content-Type': 'application/json' }, getAuthHeaders())
		});
	};
});

