app.controller('AdminController', function($scope, $location, $timeout, AdminService, FoodService, AuthService, ToastService) {

    if (!AuthService.isAuthenticated()) {
        $location.path('/login');
        return;
    }

    $scope.currentPage = 'views/admin/dashboard.html';
    $scope.activePage = 'dashboard';

    $scope.foodAdmin = {
        foods: [],
        searchText: "",
        food: {},
        editIndex: undefined,
        showForm: false
    };

    $scope.orders = [];

    $scope.users = [];

    function mapOrders(rawOrders) {
        return (rawOrders || []).map(function(order) {
            var createdAt = order.createdAt ? new Date(order.createdAt) : null;

            return {
                id: order._id,
                backendId: order._id,
                user: {
                    name: order.userId && order.userId.name ? order.userId.name : 'Unknown',
                    email: order.userId && order.userId.email ? order.userId.email : ''
                },
                items: (order.items || []).map(function(item) {
                    var food = item.foodId || {};
                    return {
                        name: food.name || 'Item',
                        category: food.category || 'Other',
                        price: food.price || 0,
                        quantity: item.quantity || 0
                    };
                }),
                total: order.totalAmount || 0,
                status: order.status || 'Pending',
                createdAt: createdAt,
                date: createdAt ? createdAt.toLocaleString() : ''
            };
        });
    }

    function loadFoods() {
        FoodService.getFoods()
            .then(function(res) {
                var list = res.data && res.data.foods ? res.data.foods : res.data;
                $scope.foodAdmin.foods = (list || []).map(function(item) {
                    return {
                        _id: item._id,
                        name: item.name,
                        category: item.category,
                        price: item.price,
                        type: item.type || '',
                        description: item.description,
                        image: item.image
                    };
                });
            })
            .catch(function(err) {
                console.error('Error loading foods for admin', err);
                ToastService.error('Failed to load foods');
            });
    }

    function loadOrders() {
        AdminService.getAllOrders()
            .then(function(res) {
                var list = res.data && res.data.order ? res.data.order : res.data;
                $scope.orders = mapOrders(list);

                // After orders load, (re)build charts for the
                // currently active admin page so they don't rely
                // on a manual tab switch to appear.
                $timeout(function() {
                    if ($scope.activePage === 'dashboard') {
                        buildDailyRevenueChart('dailyRevenueChartDashboard');
                        buildDailyStatusChart('dailyStatusChartDashboard');
                    } else if ($scope.activePage === 'reports') {
                        buildMonthlyRevenueChart();
                        buildStatusChart();
                    }
                }, 0);
            })
            .catch(function(err) {
                console.error('Error loading orders for admin', err);
                ToastService.error('Failed to load orders');
            });
    }

    function loadUsers() {
        AdminService.getUsers()
            .then(function(res) {
                var list = res.data && res.data.users ? res.data.users : res.data;
                $scope.users = (list || []).map(function(u) {
                    return {
                        id: u._id,
                        name: u.name,
                        email: u.email,
                        role: u.role,
                        status: u.status || 'Active'
                    };
                });
            })
            .catch(function(err) {
                console.warn('Failed to load users for admin (API may not exist yet)', err);
            });
    }

    $scope.saveFood = function() {
        var fa = $scope.foodAdmin;

        if (!fa.food || !fa.food.name) {
            return;
        }

        var payload = {
            name: fa.food.name,
            category: fa.food.category,
            price: fa.food.price,
            type: fa.food.type,
            description: fa.food.description,
            image: fa.food.image
        };

        if (fa.editIndex !== undefined && fa.editIndex !== null && fa.food._id) {
            AdminService.updateFood(fa.food._id, payload)
                .then(function() {
                    ToastService.success('Food updated');
                    loadFoods();
                })
                .catch(function(err) {
                    console.error('Error updating food', err);
                    ToastService.error('Failed to update food');
                });
        } else {
            AdminService.addFood(payload)
                .then(function() {
                    ToastService.success('Food added');
                    loadFoods();
                })
                .catch(function(err) {
                    console.error('Error adding food', err);
                    ToastService.error('Failed to add food');
                });
        }

        fa.food = {};
        fa.searchText = "";
        fa.showForm = false;
        fa.editIndex = undefined;
    };

    $scope.editItem = function(item) {
        var fa = $scope.foodAdmin;
        fa.food = angular.copy(item);
        fa.editIndex = fa.foods.indexOf(item);
        fa.showForm = true;
    };

    $scope.deleteItem = function(index) {
        var fa = $scope.foodAdmin;
        var item = fa.foods[index];

        if (!item || !item._id) {
            return;
        }

        AdminService.deleteFood(item._id)
            .then(function() {
                ToastService.success('Food deleted');
                loadFoods();
            })
            .catch(function(err) {
                console.error('Error deleting food', err);
                ToastService.error('Failed to delete food');
            });
    };

    $scope.cancelEdit = function() {
        var fa = $scope.foodAdmin;
        fa.food = {};
        fa.editIndex = undefined;
        fa.showForm = false;
    };

    $scope.setPage = function(page) {
        if (page === 'dashboard') {
            $scope.currentPage = 'views/admin/dashboard.html';
            $scope.activePage = 'dashboard';
        } else if (page === 'food') {
            $scope.currentPage = 'views/admin/food.html';
            $scope.activePage = 'food';
            loadFoods();
        } else if (page === 'users') {
            $scope.currentPage = 'views/admin/users.html';
            $scope.activePage = 'users';
            loadUsers();
        } else if (page === 'orders') {
            $scope.currentPage = 'views/admin/orders.html';
            $scope.activePage = 'orders';
            loadOrders();
        } else if (page === 'reports') {
            $scope.currentPage = 'views/admin/reports.html';
            $scope.activePage = 'reports';
            loadOrders();
        } else if (page === 'user-view') {
            $location.path('/home');
        }
    };

    $scope.deleteUser = function(index) {
        var user = $scope.users[index];
        if (!user || !user.id) {
            return;
        }

        AdminService.updateUserStatus(user.id, 'Inactive')
            .then(function() {
                $scope.users.splice(index, 1);
                ToastService.success('User deactivated');
            })
            .catch(function(err) {
                console.error('Error deactivating user', err);
                ToastService.error('Failed to update user');
            });
    };

    $scope.toggleStatus = function(user) {
        if (!user || !user.id) {
            return;
        }

        var nextStatus = user.status === 'Active' ? 'Inactive' : 'Active';

        AdminService.updateUserStatus(user.id, nextStatus)
            .then(function() {
                user.status = nextStatus;
                ToastService.success('User status updated');
            })
            .catch(function(err) {
                console.error('Error updating user status', err);
                ToastService.error('Failed to update user status');
            });
    };

    $scope.updateStatus = function(order) {
        if (!order || !order.backendId) {
            return;
        }

        var nextStatus;
        if (order.status === 'Pending') {
            nextStatus = 'Preparing';
        } else if (order.status === 'Preparing') {
            nextStatus = 'Delivered';
        } else {
            nextStatus = order.status;
        }

        if (!nextStatus || nextStatus === order.status) {
            return;
        }

        AdminService.updateOrderStatus(order.backendId, nextStatus)
            .then(function() {
                order.status = nextStatus;
                ToastService.success('Order status updated');
            })
            .catch(function(err) {
                console.error('Error updating order status', err);
                ToastService.error('Failed to update order status');
            });
    };

    $scope.getTotalOrders = function() {
        return $scope.orders.length;
    };

    $scope.getTopItems = function() {
        var itemMap = {};

        $scope.orders.forEach(function(order) {
            (order.items || []).forEach(function(item) {
                if (!itemMap[item.name]) {
                    itemMap[item.name] = 0;
                }
                itemMap[item.name] += item.quantity || 0;
            });
        });

        var result = Object.keys(itemMap).map(function(name) {
            return {
                name: name,
                qty: itemMap[name]
            };
        });

        return result.sort(function(a, b) { return b.qty - a.qty; }).slice(0, 5);
    };

    function calculateTotalRevenue() {
        var total = 0;
        ($scope.orders || []).forEach(function(order) {
            total += order.total || 0;
        });
        return total;
    }

    $scope.getRevenue = function() {
        return calculateTotalRevenue();
    };

    $scope.getAverageOrderValue = function() {
        if (!$scope.orders || !$scope.orders.length) {
            return 0;
        }
        return calculateTotalRevenue() / $scope.orders.length;
    };

    $scope.getGrowthRate = function() {
        if (!$scope.orders || !$scope.orders.length) {
            return 0;
        }

        var now = new Date();
        var currentStart = new Date(now.getTime());
        currentStart.setMonth(currentStart.getMonth() - 1);
        var previousStart = new Date(currentStart.getTime());
        previousStart.setMonth(previousStart.getMonth() - 1);

        var currentRevenue = 0;
        var previousRevenue = 0;

        ($scope.orders || []).forEach(function(order) {
            if (!order.createdAt) {
                return;
            }

            if (order.createdAt >= currentStart) {
                currentRevenue += order.total || 0;
            } else if (order.createdAt >= previousStart && order.createdAt < currentStart) {
                previousRevenue += order.total || 0;
            }
        });

        if (!previousRevenue) {
            return 0;
        }

        var change = ((currentRevenue - previousRevenue) / previousRevenue) * 100;
        return Math.round(change * 10) / 10; // one decimal place
    };

    $scope.getStatusPercentage = function(status) {
        if (!$scope.orders || !$scope.orders.length) {
            return 0;
        }

        var counts = {};
        var totalCount = 0;

        ($scope.orders || []).forEach(function(order) {
            var s = order.status || 'Pending';
            counts[s] = (counts[s] || 0) + 1;
            totalCount += 1;
        });

        if (!totalCount || !counts[status]) {
            return 0;
        }

        return Math.round((counts[status] / totalCount) * 100);
    };

    $scope.logout = function() {
        AuthService.logout();
        $location.path('/login');
    };

    function buildDailyRevenueChart(canvasId) {
        if (typeof Chart === 'undefined') {
            return;
        }

        var ctx = document.getElementById(canvasId);
        if (!ctx) {
            return;
        }

        var existing = Chart.getChart ? Chart.getChart(ctx) : null;
        if (existing) {
            existing.destroy();
        }

        var now = new Date();
        var labels = [];
        var data = [];

        // Last 7 days, oldest to newest
        for (var i = 6; i >= 0; i--) {
            var d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
            var label = (d.getMonth() + 1) + '/' + d.getDate();

            var dayRevenue = 0;
            ($scope.orders || []).forEach(function(order) {
                if (!order.createdAt) {
                    return;
                }
                var od = order.createdAt;
                if (od.getFullYear() === d.getFullYear() && od.getMonth() === d.getMonth() && od.getDate() === d.getDate()) {
                    dayRevenue += order.total || 0;
                }
            });

            labels.push(label);
            data.push(dayRevenue);
        }

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Revenue (₹)',
                    data: data,
                    backgroundColor: '#f97316'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                }
            }
        });
    }

    function buildDailyStatusChart(canvasId) {
        if (typeof Chart === 'undefined') {
            return;
        }

        var ctx = document.getElementById(canvasId);
        if (!ctx) {
            return;
        }

        var existing = Chart.getChart ? Chart.getChart(ctx) : null;
        if (existing) {
            existing.destroy();
        }

        var now = new Date();
        var labels = [];
        var statuses = ['Pending', 'Preparing', 'Delivered'];
        var dataMap = {
            Pending: [],
            Preparing: [],
            Delivered: []
        };

        // Last 7 days, oldest to newest
        for (var i = 6; i >= 0; i--) {
            var d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
            var label = (d.getMonth() + 1) + '/' + d.getDate();
            labels.push(label);

            var counts = {
                Pending: 0,
                Preparing: 0,
                Delivered: 0
            };

            ($scope.orders || []).forEach(function(order) {
                if (!order.createdAt) {
                    return;
                }
                var od = order.createdAt;
                if (od.getFullYear() === d.getFullYear() && od.getMonth() === d.getMonth() && od.getDate() === d.getDate()) {
                    var s = order.status || 'Pending';
                    if (!counts[s]) {
                        counts[s] = 0;
                    }
                    counts[s] += 1;
                }
            });

            statuses.forEach(function(s) {
                dataMap[s].push(counts[s] || 0);
            });
        }

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Pending',
                        data: dataMap.Pending,
                        backgroundColor: '#fbbf24',
                        stack: 'status'
                    },
                    {
                        label: 'Preparing',
                        data: dataMap.Preparing,
                        backgroundColor: '#38bdf8',
                        stack: 'status'
                    },
                    {
                        label: 'Delivered',
                        data: dataMap.Delivered,
                        backgroundColor: '#22c55e',
                        stack: 'status'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        stacked: true
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                }
            }
        });
    }

    function buildStatusChart() {
        if (typeof Chart === 'undefined') {
            return;
        }

        var ctx = document.getElementById('statusChart');
        if (!ctx) {
            return;
        }

        var existing = Chart.getChart ? Chart.getChart(ctx) : null;
        if (existing) {
            existing.destroy();
        }

        var counts = {};
        var labels = ['Pending', 'Preparing', 'Delivered'];

        ($scope.orders || []).forEach(function(order) {
            var s = order.status || 'Pending';
            counts[s] = (counts[s] || 0) + 1;
        });

        var data = labels.map(function(label) {
            return counts[label] || 0;
        });

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: ['#f97316', '#38bdf8', '#22c55e']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    function buildMonthlyRevenueChart() {
        if (typeof Chart === 'undefined') {
            return;
        }

        var ctx = document.getElementById('monthlyRevenueChart');
        if (!ctx) {
            return;
        }

        var existing = Chart.getChart ? Chart.getChart(ctx) : null;
        if (existing) {
            existing.destroy();
        }

        var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var now = new Date();
        var labels = [];
        var data = [];

        // Last 6 months, oldest to newest
        for (var i = 5; i >= 0; i--) {
            var d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            var label = monthNames[d.getMonth()];

            var monthRevenue = 0;
            ($scope.orders || []).forEach(function(order) {
                if (!order.createdAt) {
                    return;
                }
                var od = order.createdAt;
                if (od.getFullYear() === d.getFullYear() && od.getMonth() === d.getMonth()) {
                    monthRevenue += order.total || 0;
                }
            });

            labels.push(label);
            data.push(monthRevenue);
        }

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Revenue (₹)',
                    data: data,
                    backgroundColor: '#f97316'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                }
            }
        });
    }

    $scope.initReportsCharts = function() {
        // Delay chart creation until the template is rendered
        $timeout(function() {
            buildMonthlyRevenueChart();
            buildStatusChart();
        }, 0);
    };

    $scope.initDashboardCharts = function() {
        $timeout(function() {
            buildDailyRevenueChart('dailyRevenueChartDashboard');
            buildDailyStatusChart('dailyStatusChartDashboard');
        }, 0);
    };

    loadOrders();
    loadFoods();
});