app.controller('ProfileController', function($scope) {

    $scope.user = JSON.parse(localStorage.getItem('user')) || {
        name: "Guest User",
        email: "guest@email.com"
    };

});