app.controller('AuthController', function($scope, $location, AuthService, ToastService) {

    $scope.user = {};
    $scope.isLogin = true; // default tab

    $scope.login = function() {
        AuthService.login($scope.user)
        .then(function(res) {
            // Save JWT token so we know user is logged in
            if (res.data && res.data.token) {
                AuthService.setToken(res.data.token);
            }

            // Cache user info returned from backend (includes role)
            var loggedInUser = res.data && res.data.user ? res.data.user : null;
            if (loggedInUser) {
                AuthService.setCurrentUser(loggedInUser);
            }

            ToastService.success("Login successful");

            // If the logged in user is an admin, send them to the admin panel
            if (loggedInUser && loggedInUser.role === 'admin') {
                $location.path('/admin');
            } else {
                // Normal users go to home page
                $location.path('/home');
            }
        })
        .catch(function(err) {
            ToastService.error("Login failed. Please check your credentials.");
        });
    };

    $scope.register = function() {
        AuthService.register($scope.user)
        .then(function(res) {
            ToastService.success("Registration successful. You can now log in.");
            $scope.isLogin = true; // switch to login
        })
        .catch(function(err) {
            ToastService.error("Registration failed. Please try again.");
        });
    };

});