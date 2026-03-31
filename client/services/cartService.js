app.service('CartService', function() {

    var cart = JSON.parse(localStorage.getItem('cart')) || [];

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    this.getCart = function() {
        return cart;
    };

    this.getCartCount = function() {
        return cart.reduce(function(total, item) {
            return total + (item.quantity || 0);
        }, 0);
    };

    this.addToCart = function(item) {
        var existing = cart.find(c => c.name === item.name);

        if (existing) {
            existing.quantity++;
        } else {
            item.quantity = 1;
            cart.push(item);
        }

        saveCart();
    };

    this.removeItem = function(index) {
        cart.splice(index, 1);
        saveCart();
    };

    this.updateQuantity = function(index, change) {
        cart[index].quantity += change;

        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }

        saveCart();
    };

    this.clearCart = function() {
        cart.length = 0;
        saveCart();
    };

});