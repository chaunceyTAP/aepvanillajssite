window.adobeDataLayer = window.adobeDataLayer || []
state = []
alloy('configure', {
  orgId: '18F332CC5B4DB4150A495DF0@AdobeOrg',
  edgeConfigId: 'dcf820d0-2016-41e5-a0ce-2853e214114b',
})

console.log('addded alloyc config')
const personalization = {}
// try {
alloy('sendEvent', {
  renderDecisions: true,
  personalization: {
    sendDisplayEvent: true,
    surfaces: [
      '#cp-code-based-html',
      'web://chaunceytap.github.io/aepvanillajssite',
      'web://chaunceytap.github.io/aepvanillajssite#cp-code-based-html',
      '#code-based',
      'web://chaunceytap.github.io/aepvanillajssite#code-based',
    ],
  },
}).then((res) => {
  console.log(
    `this is returned from the code based experience${JSON.stringify(res)}`
  )
  if (res.decisions) {
    const con = res.decisions.items.data
    console.log(con)
    const content = (con.document.getElementById(
      '#cp-code-based-html'
    ).innerHTML = content)
    console.log('update the dom with the code based experience')
  } else {
    console.error('No experience content received.')
  }
})

console.log(window.adobeDataLayer)
let cartItems = []
const cartSummary = document.getElementById('cart-items')
const cartTotal = document.getElementById('cart-total')
let dt = new Date().getTime()
let ECID = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
  /[xy]/g,
  function (c) {
    const r = (dt + Math.random() * 16) % 16 | 0
    dt = Math.floor(dt / 16)
    return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16)
  }
)
window.adobeDataLayer.push({ personID: ECID })

document.querySelectorAll('.add-to-cart').forEach((button) => {
  button.addEventListener('click', () => {
    const product = button.dataset.product
    const price = parseFloat(button.dataset.price)
    const sku = button.dataset.product
    // Add product to cart
    cartItems.push({ product, price, sku })
    // adobeDataLayer.push({ cartItems })

    window.adobeDataLayer.push({ addedToCart: { items: [...cartItems] } })
    console.log(window.adobeDataLayer)
    updateCart()
  })
})

function updateCart() {
  // Clear the cart summary
  cartSummary.innerHTML = ''
  let total = 0

  // Update cart items and total price
  cartItems.forEach((item, index) => {
    const li = document.createElement('li')
    li.className = 'cart-item'
    li.innerHTML = `
      ${item.product} - $${item.price}
      <button class="remove-from-cart" data-index="${index}">Remove</button>
    `
    cartSummary.appendChild(li)
    total += item.price
  })

  // Update total price display
  cartTotal.textContent = total

  // Add event listeners to remove buttons
  document.querySelectorAll('.remove-from-cart').forEach((button) => {
    button.addEventListener('click', () => {
      const index = button.dataset.index
      removeFromCart(index)
      window.adobeDataLayer.push({
        updatedCart: { items: [...cartItems], total },
      })
    })
  })
}

function removeFromCart(index) {
  // Remove item from cart
  window.adobeDataLayer = []

  cartItems.splice(index, 1)
  updateCart()
}

document.getElementById('checkout-form').addEventListener('submit', (e) => {
  // state.push({ event: 'purchase', cartItems: cartItems })
  // window.adobeDataLayer = state
  // window.adobeDataLayer.pop('addedToCart')
  // window.adobeDataLayer.pop('updatedCart')

  for (let item in window.adobeDataLayer) {
    if (item.product) {
      window.adobeDataLayer.shift()
    }
  }

  e.preventDefault()
  // alert(JSON.stringify(state))
  console.log(JSON.stringify(state))

  // Capture the name and email
  const name = document.getElementById('name').value
  const email = document.getElementById('email').value
  // let dt = new Date().getTime()
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
    /[xy]/g,
    function (c) {
      const r = (dt + Math.random() * 16) % 16 | 0
      dt = Math.floor(dt / 16)
      return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16)
    }
  )
  const eventId = 'xxxxxxxx-xxxx-8xxx-yxxx-xxxxxxxxxxxx'.replace(
    /[xy]/g,
    function (c) {
      const r = (dt + Math.random() * 16) % 16 | 0
      dt = Math.floor(dt / 16)
      return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16)
    }
  )
  const personId = uuid

  // Create an object with the captured data
  const customerData = {
    event: 'checkoutSubmit',
    _id: eventId,
    _taplondonptrsd: {
      email: { address: email },
      contactId: personId,
    },
    _experience: {
      campaign: {
        orchestration: {
          eventID:
            'f77d8217ce0d57a43dc15f62b34a3ec617e9ce72ac6d5e09492367f74e67000a',
        },
      },
    },
    productListItems: cartItems.map((item) => ({
      priceTotal: item.price,
      SKU: item.product,
    })),
    timestamp: '2024-12-10T11:57:47.000Z',
  }

  // Push the customer data to the data layer
  window.adobeDataLayer.push(customerData)

  alloy('sendEvent', {
    data: { customerData },
    documentUnloading: false,
    // edgeConfigOverrides: {
    //   datastreamId: 'dcf820d0-2016-41e5-a0ce-2853e214114b',
    // },
    renderDecisions: true,
    type: 'checkoutSubmit',
    xdm: customerData,
  }).then((response) => {
    console.log(response)
    if (response.experience) {
      const content = response.experience[0].content
      document.getElementById('#cp-code-based-html').innerHTML = content
    } else {
      console.error('No experience content received.')
    }
  })

  console.log('Customer data pushed to the data layer:', customerData)

  // Reset cart and form
  cartItems.length = 0
  updateCart()
  e.target.reset()
})
