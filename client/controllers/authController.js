app.controller('AuthController', function($scope, $location, AuthService) {

    $scope.user = {};

    $scope.login = function() {
        AuthService.login($scope.user)
        .then(function(response) {
            alert("Login successful");
            $location.path('/home');
        })
        .catch(function(error) {
            alert("Login failed");
        });
    };

    $scope.register = function() {
        AuthService.register($scope.user)
        .then(function(response) {
            alert("Registration successful, please login.");
            $scope.user = {};
            $location.path('/login');
        })
        .catch(function(error) {
            alert("Registration failed");
        });
    };

    $scope.goToRegister = function() {
        $location.path('/register');
    };

    $scope.goToLogin = function() {
        $location.path('/login');
    };
});
