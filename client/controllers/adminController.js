app.controller('AdminController', function($scope) {

    // 📊 Dashboard data (can later be replaced with real backend data)
    $scope.orders = JSON.parse(localStorage.getItem('orders')) || [];

    // 🔥 Default page
    $scope.currentPage = 'views/admin/dashboard.html';

    // 🍔 All state for managing food items lives under one object
    $scope.foodAdmin = {
        foods: JSON.parse(localStorage.getItem('adminFoods')) || [],
        searchText: "",
        food: {},
        editIndex: undefined,
        showForm: false
    };

    // ➕ Save food (add or update)
    $scope.saveFood = function() {

        var fa = $scope.foodAdmin;

        if (!fa.food || !fa.food.name) return;

        if (fa.editIndex !== undefined && fa.editIndex !== null) {
            fa.foods[fa.editIndex] = fa.food;
            fa.editIndex = undefined;
        } else {
            fa.foods.push(fa.food);
        }

        localStorage.setItem('adminFoods', JSON.stringify(fa.foods));

        // reset form + search so new item is visible
        fa.food = {};
        fa.searchText = "";
        fa.showForm = false;
    };

    // ✏️ Edit existing food
    $scope.editItem = function(item) {
        var fa = $scope.foodAdmin;
        fa.food = angular.copy(item);
        fa.editIndex = fa.foods.indexOf(item);
        fa.showForm = true;
    };

    // 🗑 Delete food
    $scope.deleteItem = function(index) {
        var fa = $scope.foodAdmin;
        fa.foods.splice(index, 1);
        localStorage.setItem('adminFoods', JSON.stringify(fa.foods));
    };

    // ❌ Cancel and close form
    $scope.cancelEdit = function() {
        var fa = $scope.foodAdmin;
        fa.food = {};
        fa.editIndex = undefined;
        fa.showForm = false;
    };

    // 🔥 USERS DATA (temporary localStorage)
     $scope.users = JSON.parse(localStorage.getItem('users')) || [
     { name: "Darshna", email: "darshna@mail.com", role: "Admin", status: "Active" },
     { name: "User1", email: "user1@mail.com", role: "User", status: "Active" }
     ];

    // 🔁 Page switch
    $scope.setPage = function(page) {
    if (page === 'dashboard') {
        $scope.currentPage = 'views/admin/dashboard.html';
    }
    else if (page === 'food') {
        $scope.currentPage = 'views/admin/food.html';
    }
    else if (page === 'users') {
        $scope.currentPage = 'views/admin/users.html';
    }
    else if (page === 'orders') {
        $scope.currentPage = 'views/admin/orders.html';
    }
    else if (page === 'reports') {
        $scope.currentPage = 'views/admin/reports.html';
    }
    };

     // 🗑 Delete user
     $scope.deleteUser = function(index) {
     $scope.users.splice(index, 1);
     localStorage.setItem('users', JSON.stringify($scope.users));
     };

     // 🔄 Toggle status
     $scope.toggleStatus = function(user) {
     user.status = user.status === "Active" ? "Inactive" : "Active";
     localStorage.setItem('users', JSON.stringify($scope.users));
     };

     // 📦 Load orders
$scope.orders = JSON.parse(localStorage.getItem('orders')) || [];

// 🔄 Update order status
     $scope.updateStatus = function(order) {

     if (order.status === "Pending") {
          order.status = "Preparing";
     } 
     else if (order.status === "Preparing") {
          order.status = "Delivered";
     }

     localStorage.setItem('orders', JSON.stringify($scope.orders));
     };

     // 📦 Total Orders
     $scope.getTotalOrders = function() {
     return $scope.orders.length;
     };

     // 🍔 Top Selling Items
     $scope.getTopItems = function() {

     let itemMap = {};

     $scope.orders.forEach(order => {
          order.items.forEach(item => {
               if (!itemMap[item.name]) {
                    itemMap[item.name] = 0;
               }
               itemMap[item.name] += item.quantity;
          });
     });

     let result = Object.keys(itemMap).map(name => ({
          name,
          qty: itemMap[name]
     }));

     return result.sort((a, b) => b.qty - a.qty).slice(0, 5);
     };
});