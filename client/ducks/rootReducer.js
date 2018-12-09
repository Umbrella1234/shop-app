import { combineReducers } from 'redux'
import { productsReducer } from './productsDucks'
import { ordersReducer } from './ordersDucks'
import { cartReducer } from './cartDucks'
import { alertReducer } from './alertDucks'

export default combineReducers({
  products: productsReducer,
  cart: cartReducer,
  orders: ordersReducer,
  alerts: alertReducer
})
