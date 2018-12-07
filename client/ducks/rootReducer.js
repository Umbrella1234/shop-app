import { combineReducers } from 'redux'
import { productsReducer } from './productsDucks'
import { orderReducer } from './orderDucks'
import { cartReducer } from './cartDucks'
import { alertReducer } from './alertDucks'

export default combineReducers({
  products: productsReducer,
  cart: cartReducer,
  order: orderReducer,
  alerts: alertReducer
})
