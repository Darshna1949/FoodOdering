app.controller('AuthController', function($scope, $location, AuthService) {

    $scope.user = {};
    $scope.isLogin = true; // default tab

    $scope.login = function() {
        AuthService.login($scope.user)
        .then(function(res) {
            alert("Login successful");
            $location.path('/home');
        })
        .catch(function(err) {
            alert("Login failed");
        });
    };

    $scope.register = function() {
        AuthService.register($scope.user)
        .then(function(res) {
            alert("Registration successful");
            $scope.isLogin = true; // switch to login
        })
        .catch(function(err) {
            alert("Registration failed");
        });
    };

});