window.adobeDataLayer = window.adobeDataLayer || []
state = []

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
// SENDS SITE VIEW EVENT TO AEP
// const site_view = () => {
//   alloy('sendEvent', {
//     // data: customerData,
//     documentUnloading: false,
//     edgeConfigOverrides: {
//       datastreamId: 'dcf820d0-2016-41e5-a0ce-2853e214114b',
//     },
//     renderDecisions: true,
//     type: 'SITE VIEW',
//     xdm: {
//       _taplondonptrsd: {
//         ECID: ECID,
//         personID: ECID,
//       },
//       eventType: 'SITE VIEW',
//     },
//   })
// }
// site_view()

document.querySelectorAll('.add-to-cart').forEach((button) => {
  button.addEventListener('click', () => {
    const product = button.dataset.product
    const price = parseFloat(button.dataset.price)

    // Add product to cart
    cartItems.push({ product, price })
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
  alert(JSON.stringify(state))
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
    eventInfo: {
      event: 'checkoutSubmit',
      _id: eventId,
      customer: {
        name: name,
        email: email,
        personID: personId,
        contactId: personId,
        ECID: ECID,
      },
      _experience: {
        campaign: {
          orchestration: {
            eventID:
              'ccb7e2bb5d6666c6298a4cee26fefa6db49e13d9a256baa1a81f621cc4956d18',
          },
        },
      },
      cart: {
        items: cartItems.map((item) => ({
          product: item.product,
          price: item.price,
        })),
        total: cartTotal.textContent,
      },
    },

    _id: eventId,
    customer: {
      name: name,
      email: email,
      personID: personId,
      contactId: personId,
      ECID: ECID,
    },
    _experience: {
      campaign: {
        orchestration: {
          eventID:
            'ccb7e2bb5d6666c6298a4cee26fefa6db49e13d9a256baa1a81f621cc4956d18',
        },
      },
    },
    cart: {
      items: cartItems.map((item) => ({
        product: item.product,
        price: item.price,
      })),
      total: cartTotal.textContent,
    },
  }

  // Push the customer data to the data layer
  window.adobeDataLayer.push(customerData)

  alloy('sendEvent', {
    data: customerData,
    documentUnloading: false,
    edgeConfigOverrides: {
      datastreamId: 'dcf820d0-2016-41e5-a0ce-2853e214114b',
    },
    renderDecisions: true,
    type: 'commerce.purchases',
    xdm: {
      _experience: {
        campaign: {
          orchestration: {
            eventID:
              'ccb7e2bb5d6666c6298a4cee26fefa6db49e13d9a256baa1a81f621cc4956d18',
          },
        },
      },
      _taplondonptrsd: {
        contactId: customerData.eventInfo.customer.contactId,
        emailAddress: customerData.eventInfo.customer.email,
        ECID: ECID,
        personID: ECID,
      },
      _id: customerData._id,
      personID: ECID,
      eventType: customerData.event,
      productListItems: cartItems.map((item) => ({
        product: item.product,
        priceTotal: item.price,
      })),
      // [
      //   {
      //     SKU: customerData.cart.total,
      //   },
      // ],
    },
  })
  console.log('Customer data pushed to the data layer:', customerData)

  // Reset cart and form
  cartItems.length = 0
  updateCart()
  e.target.reset()
})
