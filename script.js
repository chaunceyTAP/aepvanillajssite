window.adobeDataLayer = window.adobeDataLayer || []
window.adobeDataLayer.push({ test: 'Hello World' })
console.log(window.adobeDataLayer)
let cartItems = []
const cartSummary = document.getElementById('cart-items')
const cartTotal = document.getElementById('cart-total')

document.querySelectorAll('.add-to-cart').forEach((button) => {
  button.addEventListener('click', () => {
    const product = button.dataset.product
    const price = parseFloat(button.dataset.price)

    // Add product to cart
    cartItems.push({ product, price })
    window.adobeDataLayer.push({ purchase: cartItems })

    updateCart()
  })
})

function updateCart() {
  // Clear the cart summary
  cartSummary.innerHTML = ''
  let total = 0

  // Update cart items
  cartItems.forEach((item, index) => {
    const li = document.createElement('li')
    li.className = 'cart-item'
    li.innerHTML = `
      ${item.product} - $${item.price.toFixed(2)}
      <button class="remove-from-cart" data-index="${index}">Remove</button>
    `
    cartSummary.appendChild(li)
    total += item.price
  })

  // Update total price
  cartTotal.textContent = total.toFixed(2)

  // Add event listeners to remove buttons
  document.querySelectorAll('.remove-from-cart').forEach((button) => {
    button.addEventListener('click', () => {
      const index = button.dataset.index
      removeFromCart(index)
    })
  })
}

function removeFromCart(index) {
  // Remove item from cart
  cartItems.splice(index, 1)
  updateCart()
}

document.getElementById('checkout-form').addEventListener('submit', (e) => {
  e.preventDefault()
  alert('Purchase successful!')

  // Reset cart and form
  cartItems.length = 0
  updateCart()
  e.target.reset()
})
