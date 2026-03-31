app.controller("AuthController", function($scope, authService) {

  $scope.user = {};

  // REGISTER
  $scope.register = function() {
    authService.register($scope.user)
      .then(res => {
        alert("Registered successfully");
      })
      .catch(err => {
        alert(err.data.message);
      });
  };

  // LOGIN
  $scope.login = function() {
    authService.login($scope.user)
      .then(res => {
        alert("Login successful");

        // save token
        localStorage.setItem("token", res.data.token);
      })
      .catch(err => {
        alert(err.data.message);
      });
  };

});