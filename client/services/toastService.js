app.factory('ToastService', function($rootScope, $timeout) {
    var defaultDuration = 3000;

    function show(message, type, duration) {
        if (!$rootScope.toast) {
            $rootScope.toast = {};
        }

        $rootScope.toast.message = message;
        $rootScope.toast.type = type || 'info';
        $rootScope.toast.visible = true;

        if ($rootScope.toastTimeout) {
            $timeout.cancel($rootScope.toastTimeout);
        }

        $rootScope.toastTimeout = $timeout(function() {
            if ($rootScope.toast) {
                $rootScope.toast.visible = false;
            }
        }, duration || defaultDuration);
    }

    return {
        show: show,
        success: function(message, duration) {
            show(message, 'success', duration);
        },
        error: function(message, duration) {
            show(message, 'error', duration);
        }
    };
});
