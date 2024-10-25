window.adobeDataLayer = window.adobeDataLayer || [];
state = [];

console.log(window.adobeDataLayer);
let cartItems = [];
const cartSummary = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
let dt = new Date().getTime();
let ECID = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
});
let SKU = 'xxxx-5xxx'.replace(/[xy]/g, function(c) {
    const r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
});

document.querySelectorAll('.add-to-cart').forEach((button) => {
    button.addEventListener('click', () => {
        const product = button.dataset.product;
        const price = parseFloat(button.dataset.price);

        // Check for existing product and update quantity if necessary
        const existingItem = cartItems.find((item) => item.product === product);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cartItems.push({ product, price, quantity: 1 });
        }

        // Push a snapshot of cart items to adobeDataLayer
        window.adobeDataLayer.push({ addedToCart: [...cartItems] });
        console.log(window.adobeDataLayer);

        updateCart();
    });
});

function updateCart() {
    // Clear the cart summary
    cartSummary.innerHTML = '';
    let total = 0;

    // Update cart items display
    cartItems.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'cart-item';
        li.innerHTML = \`
            \${item.product} - \$\${item.price.toFixed(2)} x \${item.quantity}
            <button class="remove-from-cart" data-index="\${index}">Remove</button>
        \`;
        cartSummary.appendChild(li);
        total += item.price * item.quantity;
    });

    // Update total price
    cartTotal.textContent = total.toFixed(2);

    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-from-cart').forEach((button) => {
        button.addEventListener('click', () => {
            const index = button.dataset.index;
            removeFromCart(index);
        });
    });
}

function removeFromCart(index) {
    // Reduce quantity or remove item from cart
    if (cartItems[index].quantity > 1) {
        cartItems[index].quantity -= 1;
    } else {
        cartItems.splice(index, 1);
    }
    window.adobeDataLayer.push({ updatedCart: [...cartItems] });
    updateCart();
}

document.getElementById('checkout-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
    const eventId = 'xxxxxxxx-xxxx-8xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
    const personId = uuid;

    const customerData = {
        event: 'checkoutSubmit',
        eventInfo: {
            event: 'checkoutSubmit',
            _id: eventId,
            customer: {
                name: name,
                email: email,
                personID: personId,
                contactId: personId,
                ECID: ECID
            },
            cart: {
                items: cartItems.map((item) => ({
                    product: item.product,
                    price: item.price,
                    quantity: item.quantity
                })),
                total: cartTotal.textContent
            }
        }
    };

    window.adobeDataLayer.push(customerData);
    console.log('Customer data pushed to the data layer:', customerData);

    cartItems.length = 0;
    updateCart();
    e.target.reset();
});
