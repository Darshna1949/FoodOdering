app.controller('ProfileController', function($scope, AuthService, ToastService) {

    // Default to guest
    $scope.user = {
        name: "Guest User",
        email: "guest@email.com",
        phone: "",
        address: ""
    };

    function loadProfile() {
        // Use any cached user from login first
        var cachedUser = AuthService.getCurrentUser && AuthService.getCurrentUser();
        if (cachedUser) {
            $scope.user = cachedUser;
        }

        // If authenticated, always try to refresh profile from backend
        if (AuthService.isAuthenticated()) {
            AuthService.getProfile()
                .then(function(res) {
                    if (res.data && res.data.user) {
                        $scope.user = res.data.user;
                        AuthService.setCurrentUser(res.data.user);
                    }
                })
                .catch(function() {
                    // If fetching profile fails, keep current user (guest or cached)
                });
        }
    }

    $scope.saveProfile = function() {
        if (!AuthService.isAuthenticated()) {
            if (ToastService && ToastService.error) {
                ToastService.error("Please login to update profile");
            } else {
                alert("Please login to update profile");
            }
            return;
        }

        var payload = {
            name: $scope.user.name,
            phone: $scope.user.phone,
            address: $scope.user.address
        };

        AuthService.updateProfile(payload)
            .then(function(res) {
                if (res.data && res.data.user) {
                    $scope.user = res.data.user;
                    AuthService.setCurrentUser(res.data.user);
                }
                if (ToastService && ToastService.success) {
                    ToastService.success("Profile updated successfully");
                } else {
                    alert("Profile updated successfully");
                }
            })
            .catch(function() {
                if (ToastService && ToastService.error) {
                    ToastService.error("Failed to update profile");
                } else {
                    alert("Failed to update profile");
                }
            });
    };

    loadProfile();

});