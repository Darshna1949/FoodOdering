app.service('AuthService', function($http) {

    // Express server in server/server.js listens on port 5000 by default
    var baseUrl = "http://localhost:5000/api/auth";

    this.login = function(user) {
        return $http.post(baseUrl + "/login", user);
    };

    this.register = function(user) {
        return $http.post(baseUrl + "/register", user);
    };

    this.setToken = function(token) {
        localStorage.setItem('token', token);
    };

    this.getToken = function() {
        return localStorage.getItem('token');
    };

    this.isAuthenticated = function() {
        return !!localStorage.getItem('token');
    };

    this.logout = function() {
        localStorage.removeItem('token');
    };
});