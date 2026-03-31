app.service("authService", function($http) {

  const API = "http://localhost:5000/api/auth";

  this.register = function(user) {
    return $http.post(API + "/register", user);
  };

  this.login = function(user) {
    return $http.post(API + "/login", user);
  };

});