import Catalog from './containers/Catalog'
import Orders from './containers/Orders'
import Cart from './containers/Cart'

function getPath () {
  return this.path
}

export default {
  catalog: {
    path: '/catalog',
    component: Catalog,
    getLink: getPath
  },
  cart: {
    path: '/cart',
    component: Cart,
    getLink: getPath
  },
  orders: {
    path: '/orders',
    component: Orders,
    getLink: getPath
  }
}
