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
        localStorage.removeItem('user');
    };

    // Fetch currently logged in user's profile from backend
    this.getProfile = function() {
        var token = localStorage.getItem('token');
        return $http.get(baseUrl + "/me", {
            headers: {
                authorization: token || ''
            }
        });
    };

    // Update currently logged in user's profile on backend
    this.updateProfile = function(profileData) {
        var token = localStorage.getItem('token');
        return $http.put(baseUrl + "/me", profileData, {
            headers: {
                authorization: token || ''
            }
        });
    };

    this.setCurrentUser = function(user) {
        localStorage.setItem('user', JSON.stringify(user));
    };

    this.getCurrentUser = function() {
        var raw = localStorage.getItem('user');
        return raw ? JSON.parse(raw) : null;
    };
});