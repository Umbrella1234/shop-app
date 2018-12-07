import axios from 'axios'
import { createReducer } from '../utils/createReducer'

const FETCH_CART = 'FETCH_CART'
const FETCH_CART_SUCCESS = 'FETCH_CART_SUCCESS'
const FETCH_CART_ERROR = 'FETCH_CART_ERROR'

const fetchCart = () => ({
  type: FETCH_CART
})

const fetchCartSuccess = products => ({
  type: FETCH_CART_SUCCESS,
  products
})

const fetchCartError = () => ({
  type: FETCH_CART_ERROR
})

export const startFetchOrders = () => dispatch => {
  dispatch(fetchCart())
  axios
    .get('/api/v1/cart/get')
    .then(res => {
      dispatch(fetchCartSuccess(res.data.products))
    })
    .catch(() => dispatch(fetchCartError()))
}

const initialState = {
  items: [],
  isLoading: false,
  isError: false
}

export const orderReducer = createReducer(initialState, {
  [FETCH_CART]: state => ({
    ...state,
    isLoading: true,
    isError: false
  }),
  [FETCH_CART_SUCCESS]: (state, { products }) => ({
    ...state,
    items: products,
    isLoading: false,
    isError: false
  }),
  [FETCH_CART_ERROR]: state => ({
    ...state,
    isLoading: false,
    isError: true
  })
})
